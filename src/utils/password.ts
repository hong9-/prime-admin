import bcryptjs from "bcryptjs"

export const validatePassword = async(pw: string, hash: string)=> {
  return await bcryptjs.compare(pw, hash);
}

export const saltAndHashPassword = async(pw: string)=>{
  return await bcryptjs.hash(pw, await bcryptjs.genSalt(10));
};
