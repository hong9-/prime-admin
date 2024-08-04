import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
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
          isRemove: true,
        }
      }
    }
  }) as any;

  // let { people: people} = person;
  return {
    code: 0,
    people,
  }
});
