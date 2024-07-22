import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  console.log('get body: ', body, user);
  const userList = await prisma.user.findMany({
    where: {
      email: user.email
    },
    select: {
      workers: {
        select: {
          email: true,
          name: true,
          role: true,
          needPasswordReset: true,
        }
      }
    }
  })
  return {
    code: 0,
    userList,
  }
});
