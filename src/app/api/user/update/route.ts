import { Prisma, PrismaClient, User } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';
import { DefaultArgs, RequiredExtensionArgs, UserArgs } from '@prisma/client/runtime/library';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  console.log('get body: ', body, user);
  const { email, needPasswordReset } = body as any;

  const data: any = {
    email,
    needPasswordReset,
    hash: process.env.DEFAULT_HASH,
  };

  if(needPasswordReset) {
    data.hash = process.env.DEFAULT_HASH;
  }

  console.log(email, needPasswordReset, {...data})
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
    console.log('update error', res);
    return {
      code: 1405,
      message: "유저 관리자가 아닙니다."
    } as ResponseBody
  });

  // console.log('dbResponse : ', dbResponse);
  if (dbResponse.code) {
    return dbResponse;
  }

  console.log(dbResponse);
  return {
    code: 0,
  }
});

