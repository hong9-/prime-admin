import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  console.log('get body: ', body, user);

  const { email } = body as any;

  

  const dbResponse = await prisma.user.delete({
    where: {
      email,
      managers: {
        some: {
          email: user.email,
        }
      }
    }
  }).catch((res)=> {
    return {
      code: 1405,
      message: "유저 관리자가 아닙니다."
    }
  });

  console.log(dbResponse);
  return {
    code: 0,
  }
});
