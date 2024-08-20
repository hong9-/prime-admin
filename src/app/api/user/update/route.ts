import { Prisma, PrismaClient, User } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';
import { DefaultArgs, RequiredExtensionArgs, UserArgs } from '@prisma/client/runtime/library';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const { email, needPasswordReset } = body as any;

  const data: any = {
    email,
    needPasswordReset,
    ...body,
  };

  if(needPasswordReset) {
    data.hash = process.env.DEFAULT_HASH;
  }

  const dbResponse: any = await prisma.user.update({
    where: {
      email: email,
      managers: {
        some: {
          email: user.email,
        }
      }
    },
    data,
  }).catch((res)=> {
    return {
      code: 1405,
      message: "유저 관리자가 아닙니다."
    } as ResponseBody
  });

  if (dbResponse.code) {
    return dbResponse;
  }

  return {
    code: 0,
  }
});

