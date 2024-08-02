import { PrismaClient, Prisma } from '@prisma/client';
import { auth } from 'auth';
import { NextRequest, NextResponse } from 'next/server';

// const env: string = process.env.NODE_ENV || 'development';
// const prismaConfig: Prisma.PrismaClientOptions = {
//   log: env === 'development' ? ['query', 'info', 'warn', 'error'] : undefined
// }
// const prisma = new PrismaClient(prismaConfig);

const prisma = new PrismaClient({});

export interface ResponseBody {
  code: number,
  message?: string,
}
export interface RequestBody {}

export const sessionHandler = (customFunction: Function)=> {
  // console.log('sessionHandler start');
  return async(req: NextRequest, context: { params: any })=>{
    // console.log('sessionHandler async start');
    const session = await auth();
    if(session) {
      let data: any;

      if(req.method === 'POST') {
        try {
          data = await req.json();
        } catch(e) {
          data = req.text();
        }
      } else if(req.method === 'GET') {
        data = {};
        let query = new URL(req.url).searchParams;
        query.forEach((value, key)=> {
          data[key] = value;
          return 'nono';
        });
      } else {
        console.log('405: 1405', req.method);
        return new NextResponse(JSON.stringify({
          code: 1405,
          message: "올바르지 않은 요청입니다.",
        }), {
          status: 405,
          headers: {'content-type': 'application/json'}
        })
      }
      let responseData:ResponseBody;
      let status:number = 200;
      
      try {
        responseData = await customFunction(prisma, session.user, data, context);
        // console.log('response success', responseData);
      } catch(e: unknown) {
        console.log('catch in responseData', e);
        responseData = e as ResponseBody;
        if(responseData.code) {
          status = responseData.code - 1000;
        } else {
          responseData = {
            code: 1500,
            message: responseData as any,
          }
          status = 500;
        }
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
