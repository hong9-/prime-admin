import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
  const admin001 = await prisma.user.upsert({
    where: { email: 'admin001' },
    update: {},
    create: {
      name: '운영자',
      email: 'admin001',
      role: 'ADMIN',
      needPasswordReset: true,
    },
  });

  const tmNames = ['김티엠', '이티엠', '박티엠'];
  const tms = await [...Array.from(Array(3).keys())].map(async (item, i)=> {
    const id = 'tm00'+(i+1);
    return await prisma.user.upsert({
      where: { email: id },
      update: {},
      create: {
        name: tmNames[i],
        email: id,
        role: 'TM',
        needPasswordReset: true,
        managers: {
          connect: {
            email: 'admin001',
          }
        }
      },
    });
  });

  const salesNames = ['김영업', '이영업', '박영업', '최영업', '오영업', '민영업'];
  const sales = await [...Array.from(Array(3).keys())].map(async (item, i)=> {
    const id = 'sales00'+(i+1);
    return await prisma.user.upsert({
      where: { email: id },
      update: {},
      create: {
        name: salesNames[i],
        email: id,
        role: 'TM',
        needPasswordReset: true,
        managers: {
          connect: {
            email: 'admin001',
          }
        }
      },
    });
  });
  console.log(admin001);
}
main().then(async()=> {
  await prisma.$disconnect();
}).catch(async(e)=> {
  console.error(e)
  await prisma.$disconnect();
  process.exit(1);
})