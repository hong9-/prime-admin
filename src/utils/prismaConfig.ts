import { Prisma, PrismaClient } from "@prisma/client"
// import { Prisma, PrismaClient } from "@prisma/client/edge"
const env: string = process.env.NODE_ENV || 'development';

const prismaConfig: Prisma.PrismaClientOptions = {
  log: env === 'development' ? ['query', 'info', 'warn', 'error'] : undefined
}

// console.log(prismaConfig);
const prisma = new PrismaClient(prismaConfig);

console.log('프리즈마 셋팅');
export default prisma
export const runtime = "nodejs";