import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {

  const { id } = body as any;

  

  const dbResponse = await prisma.schedule.update({
    where: {
      id
    },
    data: {
      isRemove: true,
    }
  }).catch((res)=> {
    return {
      code: 1405,
      message: "유저 관리자가 아닙니다."
    }
  });

  return {
    code: 0,
  }
});
