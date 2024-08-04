import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';
import { saltAndHash } from 'utils/password';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {

  try {
    const { newPassword, confirmPassword } = body as any;

    if (!newPassword || !confirmPassword) {
      return {
        code: 1500,
        message: "Assertion error",
      }
    }

    const hash: string = await saltAndHash(newPassword);

    let result = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        hash,
        needPasswordReset: false,
      },
    });
    //session 갱신

    return {
      code: 0,
      success: true,
    }
  } catch(e) {
    return {
      code: 1500,
      message: e
    }
  }
});
