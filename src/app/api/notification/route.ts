import { PrismaClient } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';

export const GET = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {

  const monthAgo = new Date();
  monthAgo.setTime(monthAgo.getTime() - 2592000000);
  const notificationList = await prisma.user.findMany({
    where: {
      email: user.email
    },
    include: {
      Notifications: {
        where: {
          createdAt: {
            gte: monthAgo,
          }
        },
        select: {
          message: true,
          link: true,
          confirmed: true,
        }
      },
    }
  })

  return {
    code: 0,
    notificationList,
  }
});

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const { id } = body as any;

  const notificationConfirm = await prisma.notification.update({
    where: {
      id,
    },
    data: {
      confirmed: true,
    }
  });

  return {
    code: 0
  };
});