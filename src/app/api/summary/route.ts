import { PrismaClient, Prisma, Role, $Enums, ScheduleResult } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

interface scheduleFilterResult {
  date: Date;
  result: $Enums.ScheduleResult;
  manager: {
    name: string | null;
  };
  viewer: {
    name: string | null;
  }[];
}[]

type scheduleResultList = Array<scheduleFilterResult>

const numberFix = (input: number, fix: number) => {
  return ("0" + input).slice(-fix);
}

type dateType = 'NOHOUR'|'WITHHOUR';
const dateToForm = (date:Date, type?: dateType )=> {
  let defaultTime = `${
    numberFix(date.getFullYear(), 4)
  }-${
    numberFix(date.getMonth()+1, 2)
  }-${
    numberFix(date.getDate(), 2)
  }`;

  if(type !== dateToForm.NOHOUR) {
    let hour:number = !type ? 14 : date.getHours();
    let minute:number = !type ? 0 : date.getMinutes();

    defaultTime += ` ${numberFix(hour, 2)}:${numberFix(minute, 2)}`;
  }
  return defaultTime;
}

dateToForm.NOHOUR = 'NOHOUR' as dateType;
dateToForm.WITHHOUR = 'WITHHOUR' as dateType;


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
  result = Array(type === 'week' ? 7 : 15).fill(0)
  schedules.map((schedules)=> {
    let index = Math.floor((schedules.date.getTime() - start.getTime()) / resultIndex);
    result[index]++;
  });
  return result;
}
const informationFromShceduleList = (schedules: scheduleResultList, gt: Date, type: 'week'|'month')=> {
  const salesMap: {[key: string]: number} = {};
  const tmMap: {[key: string]: number} = {};
  const contractSchedules = schedules.filter((schedule)=>{
    schedule.result === ScheduleResult.CONTRACT && schedule.manager.name && (
      salesMap[schedule.manager.name] ? salesMap[schedule.manager.name]++ : (salesMap[schedule.manager.name] = 1)
    )
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

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body?: RequestBody, context?: { params: any })=> {
  // user.workers
  const { role } = user;
  const now = new Date();
  const today = dateToForm(now, dateToForm.NOHOUR);
  const todayTime = new Date(today).getTime();
  now.setTime(todayTime);
  now.setDate(now.getDate() - 1);
  const yesterdayStart = dateToForm(now, dateToForm.NOHOUR);
  
  now.setTime(todayTime);
  now.setDate(now.getDate() - now.getDay());
  const lastWeekEnd = dateToForm(now, dateToForm.NOHOUR);
  now.setTime(now.getTime() - 86400000 * 7)
  const lastWeekStart = dateToForm(now, dateToForm.NOHOUR);
  now.setTime(todayTime);
  now.setDate(1);
  const currentMonthStart = dateToForm(now, dateToForm.NOHOUR);
  now.setMonth((now.getMonth() - 1) % 12);
  const lastMonthStart = dateToForm(now, dateToForm.NOHOUR);

  const defaultSelect = {
    date: true,
    result: true,
    managerId: true,
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

  const defaultWhere: any = {
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
  
  if(role === 'ADMIN') {
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

    return {
      code: 0,
      currentWeekInfo,
      lastWeekInfo,
      currentMonthInfo,
      lastMonthInfo,
    }
  } else {
    if(role === 'TM')
      defaultWhere.creatorId = user.email;
    else if(role === 'SALES') {
      defaultWhere.managerId = user.email;
      defaultWhere.result = ScheduleResult.CONTRACT;
    } else {
      return {code:1500, message: '잘못된 접근입니다.'};
    }

    const currentWeekTotal = await prisma.schedule.count({
      where: defaultWhere
    });
    defaultWhere.date = {
      gt: new Date(lastWeekStart),
      lt: new Date(lastWeekEnd),
    }
    const lastWeekTotal = await prisma.schedule.count({
      where: defaultWhere
    });

    
    const todayStart = new Date();
    todayStart.setHours(0);
    todayStart.setMinutes(0);
    todayStart.setSeconds(0);
    todayStart.setMilliseconds(0);

    defaultWhere.date = {
      gt: new Date(yesterdayStart),
      lt: new Date(todayStart),
    }
    const yesterdayTotal = await prisma.schedule.count({
      where: defaultWhere
    });
    
    defaultWhere.date = {
      gt: new Date(todayStart),
      lt: new Date(),
    }
    const todayTotal = await prisma.schedule.count({
      where: defaultWhere
    });

    return {
      code: 0,
      currentWeekTotal,
      lastWeekTotal,
      yesterdayTotal,
      todayTotal,
    }    
  }
});
