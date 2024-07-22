import NextAuth, { CredentialsSignin, User, type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword, validatePassword } from "./utils/password"
// import Error from "next/error";
import config from "../config/config.json"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, Prisma } from "@prisma/client"
import { validateDate } from "@mui/x-date-pickers/internals"


const env: string = process.env.NODE_ENV || 'development';
// console.log('env: ', process.env.NODE_ENV, 'development');
// console.log(process.env.DATABASE_URL);

const prismaConfig: Prisma.PrismaClientOptions = {
  log: env === 'development' ? ['query', 'info', 'warn', 'error'] : undefined
}

console.log(prismaConfig);
const prisma = new PrismaClient(prismaConfig);

class CredentialError extends CredentialsSignin {
  code = "아이디 또는 패스워드에 문제가 있습니다."
}

export interface Notification {
  id: string,
  message: string,
  link: string,
  confirmed: boolean,
}

export interface Summary {
  callThisWeek: Number,
  callThisMonth: Number,
  dealThisWeek: Number,
  dealThisMonth: Number,
}

export interface Worker {
  email: string,
  name: string,
  role: 'ADMIN'|'TM'|'SALES',
}

export interface userInfo {
  id: string,
  email: string,
  name: string
  role: 'ADMIN'|'TM'|'SALES',
  notifications?: Array<Notification>,
  summary?: Summary,
  workers?: Array<Worker>,
}

// const getUserFromDb = async(id: string, pwHash: string)=>{
//   let adminExample: userInfo = {
//     id,
//     userId: "admin001",
//     name: "운영자",
//     role: "ADMIN",
//     notifications: [
//       {
//         id: '1234',
//         message: '알림내용 짤븡거',
//         link: 'http://localhost',
//         confirmed: true,
//       }, {
//         id: '5678',
//         message: '알림내용 긴거긴거긴거긴거 긴거긴거긴거긴거 긴거긴거긴거긴거 긴거긴거긴거긴거 긴거긴거긴거긴거',
//         link: 'http://localhost',
//         confirmed: false,
//       }, {
//         id: '9012',
//         message: '알림내용 긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거',
//         link: 'http://localhost',
//         confirmed: true,
//       }, {
//         id: '3456',
//         message: '알림내용 짤븡거',
//         link: 'http://localhost',
//         confirmed: false,
//       }
//     ],
//     summary: {
//       callThisWeek: 20,
//       callThisMonth: 50,
//       dealThisWeek: 15,
//       dealThisMonth: 35,      
//     },
//     workers: [{
//       userId: "tm001",
//       name: "김영자",
//       role: "TM",
//     }, {
//       userId: "sales001",
//       name: "이영자",
//       role: "SALES",
//     }]
//   }
//   let tmExample = {
//     id,
//     userId: "tm001",
//     name: "김영자",
//     role: "TM",
//     workers: [{
//       userId: "sales001",
//       name: "이영자",
//       role: "SALES",
//     }, {
//       userId: "sales001",
//       name: "이영자",
//       role: "SALES",
//     }, {
//       userId: "sales001",
//       name: "이영자",
//       role: "SALES",
//     }]
//   }
//   let salesExample = {
//     id,
//     userId: "sales001",
//     name: "이영자",
//     role: "SALES",
//   }
//       //   name: string
//       //   role: 'ADMIN'|'TM'|'SALES',
//       //   notifications?: Array<Notification>,
//       //   summary?: Summary,
//       //   workers?: Array<Worker>,

//   let userList = [adminExample, tmExample, salesExample];
//   let foundUser = userList.find((user)=>user.userId === id)
//   let result = null;

//   if (!foundUser) {
//     // result = {
//       // code: 1403,
//       // message: "아이디가 없습니다."
//       // throw new CredentialError("아이디가 없습니다.")
//     // }
//   } else if (pwHash !== 'test1234') {
//     // throw new CredentialError("비밀번호가 틀립니다.")
//     // {
//     //   code: 1401,
//     //   message: "아이디가 없습니다."
//     // }
//   } else result = foundUser;
//   return result;
// };

const getUserFromDb = async(email:string) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: userInfo & DefaultSession["user"]
    // {
    //   /** The user's postal address. */
    //   address: string
    //   /**
    //    * By default, TypeScript merges new interface properties and overwrites existing ones.
    //    * In this case, the default session user properties will be overwritten,
    //    * with the new ones defined above. To keep the default session user properties,
    //    * you need to add them back into the newly declared interface.
    //    */
    // } & DefaultSession["user"]
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      // `session.user.address` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      // export interface userInfo {
      //   id: string,
      //   userId: string,
      //   name: string
      //   role: 'ADMIN'|'TM'|'SALES',
      //   notifications?: Array<Notification>,
      //   summary?: Summary,
      //   workers?: Array<Worker>,
      // }
      // let { user: _user} = await auth();

      // try {
      //   user = await getUserFromDb(credentials.id);
      // } catch(e) {}
      console.log('session callback: ', session, user);
      // await getUserFromDb(session?.userId)

      return {
        ...session,
        token,
        user: {
          ...session.user,
        },
        // user,
      }
    },
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true,
  // pages: {
  //   signIn: "/Login",
  // },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        id: {},
        password: {},
      },
      authorize: async(credentials:any, request: Request)=> {
        let user:any = null;

        try {
          user = await getUserFromDb(credentials.id);
        } catch(e) {}

        if(!user) {
          console.log('No user');
          return user;
        }
        console.log('User: ', user);
        // const pwHash = await saltAndHashPassword(credentials.password);

        // prisma.account
        let { hash } = await prisma.account.findUnique({
          where: {
            userId: user.userId
          },
          select: {
            hash: true,
          }
        }) || {hash:''};

        console.log('hash : ', hash);

        if(user.needPasswordReset) {
          console.log("Need initialize password!!!");
          return user;
        }

        if(await validatePassword(await saltAndHashPassword(credentials.password), hash))
          return user;
        else return null;
        // if(user)
        //   user = await getUserFromDb(credentials.id, pwHash);
        //   credentials.user = user;
        // if (!user) {
        //   return {code:1404, message:"user not found."};
        //   // throw new Error("User not found.");
        // }
        // // credentials & user;
        // return user;
      },
    })
  ],
})
