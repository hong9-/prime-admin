let { saltAndHash } = require("./src/utils/password");
let readline = require("readline/promises");

let { stdin, stdout } = require('process');

console.log("패스워드 기본값을 입력해주세요.");
const rl = readline.createInterface({
    input: stdin,
    output: stdout,
});

rl.question('DB에 들어갈 패스워드 기본값을 입력해주세요.').then(async (password: string)=> {
    // await saltAndHash('prime1234');
    console.log(await saltAndHash(password));

    rl.close();
});
