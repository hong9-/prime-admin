import { userInfo } from "auth";
import { apiRequest } from "./api/apiRequest";
import { ScheduleResult } from "@prisma/client";

export interface schedule {
  id: string,
  date: string,
  address: string,
  result: 'NOTYET'|'CONTRACT'|'HOLD'|'NOTINTERESTED',
  creatorId: string,
  color?: string,
  title?: string,
  manager: Array<userInfo>,
  viewer: Array<userInfo>,
}

export interface scheduleDisplay {
  id: string,
  date: string,
  address: string,
  result: 'NOTYET'|'CONTRACT'|'HOLD'|'NOTINTERESTED',
  creatorId: string,
  color?: string,
  title?: string,
  manager?: string,
  managerName?: string,
  viewer?: string,
}

export const colorSet = {
  NOTYET: "55c",
  CONTRACT: "#6c6", 
  HOLD: "#999", 
  NOTINTERESTED: "#f66"
}

export const colorSetBadge = {
  NOTYET: "info",
  CONTRACT: "success", 
  HOLD: "light", 
  NOTINTERESTED: "danger"
}

const numberFix = (input: number, fix: number) => {
  return ("0" + input).slice(-fix);
}

export type dateType = 'NOHOUR'|'WITHHOUR';
export const dateToForm = (date:Date, type?: dateType )=> {
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

export const resultMap = {
  NOTYET: "방문 예정",
  CONTRACT: "계약", 
  HOLD: "보류", 
  NOTINTERESTED: "무관심"
}

export const resultList: Array<ScheduleResult> = [
  'NOTYET',
  'CONTRACT',
  'HOLD',
  'NOTINTERESTED',
]

export const scheduleToDisplay = (schedule: schedule)=> {
  return {
    ...schedule,
    managerName: schedule.manager[0].name,
    manager: schedule.manager[0].email,
    viewer: schedule.viewer && schedule.viewer.length > 0 ? schedule.viewer.map((viewer)=>viewer.name).join(',') : undefined,
  };
}

export const getSchedule = async(id: number|string)=> {
  const result = await apiRequest('post', 'schedule/'+id);
  const { code, schedule } = result;
  if(code !== 0) {
    alert(JSON.stringify(result));
    return;
  }

  return schedule;
}

export type filterItem = 'manager'|'worker'|'result';
export type orderItem = 'id'|'address'|'date'|'result';
export type orderDirection = "desc"|"asc"|undefined;
export type filter = {[key: 'manager'|'worker'|'result'|string]: any};
export interface scheduleSortParam {
  orderItem?: orderItem,
  orderDirection?: orderDirection,
  filter?: filter,
  currentAmount?: number,
  from?: string,
  to?: string,
}

export const getScheduleList = async(request: scheduleSortParam)=> {
  const result = await apiRequest('post', 'schedule', request)
  const { code, total, pageMax, scheduleList } = result;
  if(code !== 0) {
    alert(JSON.stringify(result));
    return;
  }

  return {
    scheduleList,
    pageMax,
    total,
  };
}

