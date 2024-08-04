const { sa, lt } = process.env;

export const saltAndHash = async(pw: string)=> {
  return await pbkdf2(pw, (sa || '블라블라')+(lt || '나불나불'), 256, 64);
}

export const validatePassword = async(pw: string, compare: string)=> {
  const hash = await saltAndHash(pw);
  return hash === compare;
}

const pbkdf2 = async(password:string, salt: string, iterations: number, keylen: number)=> {
  const enc = new TextEncoder();
  const passwordBuffer = enc.encode(password);
  const saltBuffer = enc.encode(salt);

  const importedKey = await crypto.subtle.importKey(
    'raw', 
    passwordBuffer, 
    {name: 'PBKDF2'}, 
    false, 
    ['deriveBits', 'deriveKey']
  );

  const derivedKeyBuffer = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltBuffer,
    iterations: iterations,
    hash: 'SHA-512'
  }, importedKey, keylen * 8);

  return Buffer.from(derivedKeyBuffer).toString('base64url');
}
