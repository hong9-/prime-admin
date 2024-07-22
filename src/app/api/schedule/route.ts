import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  console.log('get body: ', body, user);
  // if (user.role === 'TM') {
    
  // }
  const scheduleList = await prisma.user.findMany({
    where: {
      email: user.email
    },
    include: {
      Schedule: {
        select: {
          date: true,
          address: true,
          note: true,
          result: true,
        }
      },
    }
  })
  return {
    code: 0,
    scheduleList,
  }
});
