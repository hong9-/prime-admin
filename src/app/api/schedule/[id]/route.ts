import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

type Params = {
  id: string,
}

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody, context: { params: Params} )=> {
  let { id } = context.params;
  let idAsNumber = parseInt(id);

  const schedules = await prisma.user.findUnique({
    where: {
      email: user.email
    },
    select: {
      Schedule: {
        where: {
          id: idAsNumber,
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
          id: idAsNumber,
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

  if(!scheduleList || scheduleList.length === 0) {
    return {
      code: 1404,
      message: "No schedule",
    }
  } else {
    let schedule = scheduleList[0];
    return {
      code: 0,
      schedule,
    }
  }
  
});
