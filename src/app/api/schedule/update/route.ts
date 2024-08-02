import { PrismaClient } from '@prisma/client';
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
  console.log('get body: ', body, user);
  const creatorId = user.email;
  const {
    id,
    company,
    companyManager,
    phone,
    address,
    note,
    date,
    manager,
    viewer,
    result,
  } = body as any;

  let data = {} as any;
  paramList.map((key)=> {
    if(key === 'manager' && manager) {
      data.manager = {connect: [{ email: manager }]};
    } else if(key === 'viewer' && viewer) {
      data.viewer = {connect: [{ email: viewer }]};
    } else if((body as {[x:string]: string})[key])
      (data as {[x:string]: string})[key] = (body as {[x:string]: string})[key]
  });

  const dbResponse = await prisma.schedule.update({
    where: {
      id,
    },
    data,
  });

  console.log(dbResponse);
  return {
    code: 0,
  }
});
