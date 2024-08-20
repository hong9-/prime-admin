import { PrismaClient, ScheduleResult } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

const paramList = [
  // 'id',
  'company',
  'companyManager',
  'phone',
  'address',
  'note',
  'date',
  'manager',
  'viewer',
  'result',
]

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const creatorId = user.email;
  const {
    id,
    company,
    companyManager,
    phone,
    address,
    addressAbstract,
    note,
    date,
    manager,
    viewer,
    result,
  } = body as any;

  if (id === '' ||
    company === '' ||
    companyManager === '' ||
    phone === '' ||
    address === '' ||
    date === '') {
    return {
      code: 1403,
      message: '아이디, 상호, 담당자, 연락처, 일정 등은 값이 있어야 합니다.'
    }
  }
  let data = {} as any;
  paramList.map((key)=> {
    if(key === 'manager' && manager) {
      data.manager = {connect: [{ email: manager }]};
    } else if(key === 'viewer' && viewer) {
      data.viewer = {connect: [{ email: viewer }]};
    } else if((body as {[x:string]: string})[key] || key === 'note') {
      (data as {[x:string]: string})[key] = (body as {[x:string]: string})[key]
    }
  });

  const dbResponse = await prisma.schedule.update({
    where: {
      id,
    },
    data,
    select: {
      id,
      company,
      manager: {
        select: {
          name: true,
        }
      }
    }
  });

  if(result === ScheduleResult.CONTRACT) {
    const notificationResponse = await prisma.notification.create({
      data: {
        message: `${dbResponse.manager.name} ${company} 계약`,
        link: `/ScheduleList/${dbResponse.id}`,
        userId: 'admin001',
      }
    })
  }
  return {
    code: 0,
  }
});
