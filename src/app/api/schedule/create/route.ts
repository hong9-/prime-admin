import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  console.log('get body: ', body, user);
  const creatorId = user.email;
  const { manager, address, date, result } = body as any;

  const dbResponse = await prisma.schedule.create({
    data: {
      date: new Date(date),
      address,
      creatorId,
      result,
      manager: {
        connect: {
          email: manager,
        }
      },
      viewer: {
        connect: [
          {
            email: creatorId,
          },
          {
            email: "admin001",
          },
        ]
      }
    }
  });

  console.log(dbResponse);
  return {
    code: 0,
  }
});
