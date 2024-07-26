import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  // console.log('get body: ', user, body);
  const { from, to } = body as any;
  // console.log(from, to);
  // if (user.role === 'TM') {
    
  // }
  const schedules = await prisma.user.findUnique({
    where: {
      email: user.email
    },
    select: {
      Schedule: {
        where: {
          date: {
            gt: new Date(from),
            lt: new Date(to),
          }
        },
        select: {
          address: true,
          date: true, 
          note: true,
          result: true,
          manager: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      WorkingSchedule: {
        where: {
          date: {
            gt: new Date(from),
            lt: new Date(to),
          }
        },
        select: {
          address: true,
          date: true, 
          note: true,
          result: true,
          manager: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    }
  });
  
  let scheduleList = schedules?.Schedule.concat(schedules.WorkingSchedule)
  
  return {
    code: 0,
    scheduleList,
  }
});
