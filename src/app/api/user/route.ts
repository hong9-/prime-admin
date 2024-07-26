import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  console.log('get body: ', body, user);
  const { workers: people } = await prisma.user.findUnique({
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
  }) as any;
  console.log('userList: ', people);

  // let { people: people} = person;
  return {
    code: 0,
    people,
  }
});
