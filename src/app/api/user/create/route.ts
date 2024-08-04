import { PrismaClient, Role } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, sessionHandler } from 'app/api/common';

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const creatorId = user.email;
  const { email, name, role } = body as any;
  const needPasswordReset = true;

  const data = {
    email,
    name,
    role,
    needPasswordReset,
    managers: {
      connect: [{
        email: creatorId,
      }],
    },
  }

  if(user.role !== Role.ADMIN)
    data.managers.connect.push({
      email: 'admin001',
    })

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
