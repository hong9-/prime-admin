import NextAuth, { CredentialsSignin, User, type DefaultSession } from "next-auth"
import authConfig from "auth.config"
import Credentials from "next-auth/providers/credentials"
import { saltAndHash, validatePassword } from "./utils/password"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { validateDate } from "@mui/x-date-pickers/internals"
import { Prisma, PrismaClient } from "@prisma/client"

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
  callThisWeek: number,
  callThisMonth: number,
  dealThisWeek: number,
  dealThisMonth: number,
}

export interface Worker {
  email: string,
  name: string,
  role: 'ADMIN'|'TM'|'SALES',
  isRemoved: boolean,
}

export interface userInfo {
  id: string,
  email: string,
  name: string,
  needPasswordReset: boolean,
  role: 'ADMIN'|'TM'|'SALES',
  Notifications?: Array<Notification>,
  summary?: Summary,
  workers?: Array<Worker>,
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: userInfo & DefaultSession["user"],
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
 
// const env: string = process.env.NODE_ENV || 'development';
// const prismaConfig: Prisma.PrismaClientOptions = {
//   log: env === 'development' ? ['query', 'info', 'warn', 'error'] : undefined
// }
// const prisma = new PrismaClient(prismaConfig);
const prisma = new PrismaClient({});

const getUserFromDb = async(email:string) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    async session({ session, token, user }) {
      let _user;
      if(!user) {
        try {
          _user = await prisma.user.findUnique({
            where: {
              email: session.user.email,
            },
            select: {
              Notifications: {
                orderBy: {
                  id: 'desc',
                },
                take: 10,
              },
              role: true,
              needPasswordReset: true,
              managers: {
                select: {
                  name: true,
                  email: true,
                  role: true,
                }
              },
              workers: {
                select: {
                  name: true,
                  email: true,
                  role: true,
                }
              },
            }
          }) || user || session.user;
        } catch(e) {
          // console.log(e);
        }
      }

      return await {
        ...session,
        token,
        user: {
          ...session.user,
          ..._user,
        },
      }
    },
  },
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
        } catch(e) {
          // console.log('user error or no user', e);
        }
        
        if(user.isRemove) {
          return null;
        }

        if(!user) {
          // console.log('No user');
          // const start = Date.now();
          // const pwHash = await saltAndHash(credentials.password);
          // console.log(pwHash, Date.now() - start);
          return user;
        }

        let { hash } = await prisma.user.findUnique({
          where: {
            email: user.email
          },
          select: {
            hash: true,
          }
        }) || {hash:''};

        // console.log('hash : ', hash);
        // console.log('start validating!!!!!!!!!!!!!!!!!!!!\n\t', hash)
        // console.log(credentials.password, await validatePassword(credentials.password, hash));
        if(await validatePassword(credentials.password, hash)) {
          // console.log(`user.email: ${user.email} validating true`)
          // if(user.needPasswordReset) {
          //   console.log("Need initialize password!!!");
          //   return user;
          // }

          return user;
        }
        else return null;
      },
    })
  ],
})
