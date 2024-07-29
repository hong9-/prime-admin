import { PrismaClient, Prisma, Role, $Enums, ScheduleResult } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';
import { dateToForm, orderDirection, orderItem } from 'app/scheduleUtil';
import { current } from '@reduxjs/toolkit';
import { whenTransitionDone } from '@fullcalendar/core/internal';
import { info } from 'console';

interface listWhere {
  orderItem: 'id'|'address'|'date'|'manager'|'worker'|'result'|undefined,
  orderDirection: 'asc'|'desc',
  filterItem: 'id'|'address'|'date'|'manager'|'worker'|'result'|undefined,
  filterValue: string|undefined,
  currentAmount: number|undefined,
  from: string,
  to: string,
}

interface scheduleFilterResult {
  date: Date;
  result: $Enums.ScheduleResult;
  manager: {
    name: string | null;
  }[];
  viewer: {
    name: string | null;
  }[];
}[]

type scheduleResultList = Array<scheduleFilterResult>

const getMax = (map: {[key: string]: number})=> {
  const result = {
    name: '',
    number: 0,
  };
  for (let key in map) {
    if (map[key] > result.number) {
      result.number = map[key];
      result.name = key;
    }
  }

  return result;
}

const getGraph = (schedules: scheduleResultList, type: 'week'|'month', start: Date)=> {
  let result: Array<number>;
  let end = new Date(start.getTime());
  end.setMonth(end.getMonth()+1);
  let resultIndex = type === 'week' ? 86400000 : ((end.getTime() - start.getTime()) / 15);
  // console.log(type, dateToForm(start), dateToForm(end), resultIndex)
  result = Array(type === 'week' ? 7 : 15).fill(0)
  schedules.map((schedules)=> {
    // console.log(schedules.date.getTime(), start.getTime(), resultIndex, (schedules.date.getTime() - start.getTime()) / resultIndex);
    let index = Math.floor((schedules.date.getTime() - start.getTime()) / resultIndex);
    result[index]++;
  });
  return result;
}
const informationFromShceduleList = (schedules: scheduleResultList, gt: Date, type: 'week'|'month')=> {
  console.log(`type: ${type}: ${dateToForm(gt, dateToForm.NOHOUR)}`)
  const salesMap: {[key: string]: number} = {};
  const tmMap: {[key: string]: number} = {};
  const contractSchedules = schedules.filter((schedule)=>{
    schedule.manager.map((manager)=>
      schedule.result === ScheduleResult.CONTRACT && manager.name && (
        salesMap[manager.name] ? salesMap[manager.name]++ : (salesMap[manager.name] = 1)
    ))
    schedule.viewer.map((viewer)=>
      viewer.name && (
        tmMap[viewer.name] ? tmMap[viewer.name]++ : (tmMap[viewer.name] = 1)
    ))
    return schedule.result === ScheduleResult.CONTRACT
  });

  const salesMax = getMax(salesMap);
  const tmMax = getMax(tmMap);
  const totalGraphArray = getGraph(schedules, type, gt);
  const contractGraphArray = getGraph(contractSchedules, type, gt);
  const contractTotal = contractSchedules.length;
  const total = schedules.length;
  return {
    salesMax,
    tmMax,
    totalGraphArray,
    contractGraphArray,
    contractTotal,
    total,
  }
}

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  user.workers
  const now = new Date();
  const today = dateToForm(now, dateToForm.NOHOUR);
  now.setDate(now.getDate() - now.getDay());
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const lastWeekEnd = dateToForm(now, dateToForm.NOHOUR);
  now.setTime(now.getTime() - 86400000 * 7)
  const lastWeekStart = dateToForm(now, dateToForm.NOHOUR);
  now.setDate(1);
  const currentMonthStart = dateToForm(now, dateToForm.NOHOUR);
  now.setMonth((now.getMonth() - 1) % 12);
  const lastMonthStart = dateToForm(now, dateToForm.NOHOUR);
  // const today = dateToForm(now, dateToForm.NOHOUR);

  console.log(`
    ${today}
    ${lastWeekEnd}
    ${lastWeekStart}
    ${currentMonthStart}
    ${lastMonthStart}
  `)
  
  const defaultSelect = {
    date: true,
    result: true,
    manager: {
      select: {
        name: true
      }
    },
    viewer: {
      where: {
        NOT: {
          email: 'admin001',
        }
      },
      select: {
        name: true
      }
    },
  }

  const defaultWhere = {
    date: {
      lt: new Date(today),
      gt: new Date(lastWeekEnd),
    },
  }

  const defaultSelectArg = {
    where: {
      ...defaultWhere,
    },
    select: defaultSelect,
  }

  const currentWeekTotal = await prisma.schedule.findMany(defaultSelectArg)
  const currentWeekInfo = informationFromShceduleList(currentWeekTotal, defaultSelectArg.where.date.gt, 'week');

  defaultSelectArg.where.date = {
    gt: new Date(currentMonthStart),
    lt: new Date(today),
  }
  const currentMonthTotal = await prisma.schedule.findMany(defaultSelectArg)
  const currentMonthInfo = informationFromShceduleList(currentMonthTotal, defaultSelectArg.where.date.gt, 'month');

  defaultSelectArg.where.date = {
    gt: new Date(lastWeekStart),
    lt: new Date(lastWeekEnd),
  }
  const lastWeekTotal = await prisma.schedule.findMany(defaultSelectArg)
  const lastWeekInfo = informationFromShceduleList(lastWeekTotal, defaultSelectArg.where.date.gt, 'week');

  defaultSelectArg.where.date = {
    gt: new Date(lastMonthStart),
    lt: new Date(currentMonthStart),
  }
  const lastMonthTotal = await prisma.schedule.findMany(defaultSelectArg)
  const lastMonthInfo = informationFromShceduleList(lastMonthTotal, defaultSelectArg.where.date.gt, 'month');

  // const lastWeekInfo = informationFromShceduleList(lastWeekTotal);
  // const currentMonthInfo = informationFromShceduleList(currentMonthTotal);
  // const lastMonthInfo = informationFromShceduleList(lastMonthTotal);
  
  // console.log(currentWeekTotal);
  return {
    code: 0,
    currentWeekInfo,
    lastWeekInfo,
    currentMonthInfo,
    lastMonthInfo,
  }
});
