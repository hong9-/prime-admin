import { PrismaClient, Prisma } from '@prisma/client';
import { auth } from 'auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const env: string = process.env.NODE_ENV || 'development';
const prismaConfig: Prisma.PrismaClientOptions = {
  log: env === 'development' ? ['query', 'info', 'warn', 'error'] : undefined
}
const prisma = new PrismaClient(prismaConfig);

export interface ResponseBody {
  code: number,
  message?: string,
}
export interface RequestBody {}

export const sessionHandler = (customFunction: Function)=> {
  return async(req: NextRequest, res: NextApiResponse)=>{
    const session = await auth();
    if(session) {
      const data = await req.json();
      let responseData:ResponseBody;
      let status:number = 200;
      
      try {
        responseData = await customFunction(prisma, session.user, data);
      } catch(e: unknown) {
        responseData = e as ResponseBody;
        status = responseData.code - 1000;
      }
  
      return new NextResponse(JSON.stringify(responseData), {
        status: status,
        headers: {'content-type': 'application/json'}
      })
    } else {
      return new NextResponse(JSON.stringify({
        code: 1401,
        message: "로그인 시간이 만료되었습니다.",
      }), {
        status: 401,
        headers: {'content-type': 'application/json'}
      })
    }
  }
}
