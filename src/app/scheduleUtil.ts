import { userInfo } from "auth";
import { apiRequest } from "./api/apiRequest";

export interface schedule {
  id: string,
  date: string,
  address: string,
  result: 'NOTYET'|'CONTRACT'|'HOLD'|'NOTINTERESTED',
  backgroundColor?: string,
  borderColor?: string,
  color?: string,
  title?: string,
  manager: Array<userInfo>
}

export const colorSet = {
  NOTYET: "55c",
  CONTRACT: "#6c6", 
  HOLD: "#999", 
  NOTINTERESTED: "#f66"
}

export const dateToForm = (date:Date, isEmptyHour?: boolean)=> {
  let hour:number = isEmptyHour ? 14 : date.getHours();
  let minute:number = isEmptyHour ? 0 : date.getMinutes();
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${hour}:${minute}`;
}

export type resultType = 'NOTYET'|'CONTRACT'|'HOLD'|'NOTINTERESTED'
  
export const resultMap = {
  NOTYET: "방문 예정",
  CONTRACT: "계약", 
  HOLD: "보류", 
  NOTINTERESTED: "무관심"
}

export const resultList: Array<resultType> = [
  'NOTYET',
  'CONTRACT',
  'HOLD',
  'NOTINTERESTED',
]

export const scheduleToDisplay = (schedule: schedule)=> {
  return {
    ...schedule,
    manager: schedule.manager[0].name,
  };
}

export const getSchedule = async(id: number|string)=> {
  const result = await apiRequest('get', 'schedule/'+id);
  const { code, schedule } = result;
  if(code !== 0) {
    alert(JSON.stringify(result));
    return;
  }

  return schedule;
}

export const getScheduleList = async(from?: string, to?: string)=> {
  let request = undefined;
  if(from && to) {
    request = { from, to }
  }
  const result = await apiRequest('get', 'schedule', request)
  const { code, scheduleList } = result;
  if(code !== 0) {
    alert(JSON.stringify(result));
    return;
  }

  return scheduleList;
}

