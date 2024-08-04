import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const creatorId = user.email;
  const {
    company,
    companyManager,
    phone,
    address,
    note,
    date,
    manager,
    result,
  } = body as any;

  const dbResponse = await prisma.schedule.create({
    data: {
      date: new Date(date || Date.now()),
      company,
      companyManager,
      note,
      phone,
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
    },
  });

  return {
    code: 0,
  }
});
