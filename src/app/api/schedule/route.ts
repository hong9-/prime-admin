import { PrismaClient, Prisma, Role, ScheduleResult } from '@prisma/client';
import { userInfo } from 'auth';
import { RequestBody, ResponseBody, sessionHandler } from 'app/api/common';
import { filter, orderDirection, orderItem } from 'app/scheduleUtil';

interface listWhere {
  orderItem: 'id'|'address'|'date'|'manager'|'worker'|'result'|undefined,
  orderDirection: 'asc'|'desc',
  filter: filter,
  currentAmount: number|undefined,
  from: string,
  to: string,
}

const tableItemMax = 10;

export const POST = sessionHandler(async (prisma: PrismaClient, user: userInfo, body: RequestBody)=> {
  const {
    orderItem,
    orderDirection,
    filter,
    currentAmount,
    from,
    to,
  } = body as listWhere;
  const { isAdmin } = body as any;

  const defaultSelect: Prisma.ScheduleSelect = {
    id: true,
    company: true,
    companyManager: true,
    phone: true,
    date: true,
    address: true,
    creatorId: true,
    note: true,
    result: true,
    manager: {
      select: {
        name: true,
        email: true,
        role: true,
      },
    },
    viewer: {
      where: {
        email: {
          not: "admin001"
        },
      },
      select: {
        name: true,
        email: true,
        role: true,
      },
    },
  }
  const defaultOrder: Prisma.ScheduleOrderByWithAggregationInput = {
    id: undefined as orderDirection,
    date: 'desc' as orderDirection,
    result: undefined as orderDirection,
    address: undefined as orderDirection,
  };
  if(orderItem && orderItem !== 'worker' && orderItem !== 'manager') {
    for(let key in defaultOrder)
      defaultOrder[key as orderItem] = undefined;
    defaultOrder[orderItem] = orderDirection;
  }
  else if(orderItem) {

  }

  const userDefaultWhere: Prisma.ScheduleWhereInput = {
    AND: [{
      isRemove: false
    }, {
      OR: [{
        manager: {
            email: user.email,
        },
      }, {
        viewer: {
          some: {
            email: user.email,
          }
        },
      }]
    }]
  }
  if(from && to) {
    (userDefaultWhere.AND as Array<Prisma.ScheduleWhereInput>).push({
      date: {
        gt: new Date(from),
        lt: new Date(to),
      }
    })
  }

  const total = await prisma.schedule.count({
    where: userDefaultWhere
  });

  if(filter) {
    if (filter.manager)
      filter.manager = {
        email: filter.manager
      };
    if (filter.viewer)
      filter.viewer = {
        some: {
          email: filter.viewer
        }
      };
    (userDefaultWhere.AND as Array<Prisma.ScheduleWhereInput>).push(filter)
    // userDefaultWhere.push(filter);
    // for(let key in filter) {
    // }
  }

  const pageMax = await prisma.schedule.count({
    where: userDefaultWhere,
    orderBy: defaultOrder,
  })
  const select = {
    where: userDefaultWhere,
    select: defaultSelect,
    orderBy: defaultOrder,
    take: from && to && !orderItem ? undefined : tableItemMax,
    skip: from && to && !orderItem ? undefined : currentAmount,
  }
  const schedules = await prisma.schedule.findMany(select)
  
  return {
    code: 0,
    total,
    pageMax,
    scheduleList: schedules,
  }
});
