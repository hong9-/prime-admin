import { Prisma, PrismaClient, Role } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, sessionHandler } from 'app/api/common';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const creatorId = user.email;
  const { email, name, role } = body as any;
  const needPasswordReset = true;

  const managers = await prisma.user.findMany({
    where: {
      OR: [{
        role: Role.ADMIN,
      }, {
        role: Role.TM,
      }],
    },
    select: {
      email: true,
    },
  });

  const data = {
    email,
    name,
    role,
    needPasswordReset,
    managers: {
      connect: managers as any,
    },
  };

  const dbResponse = await prisma.user.upsert({
    where: {
      email,
    },
    create: data,
    update: {
      ...body,
    }
  });

  return {
    code: 0,
  }
});
