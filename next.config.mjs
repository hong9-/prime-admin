/** @type {import('next').NextConfig} */
// import { version } from "./package.json"
// const { version } = require('node:process');
// import {version} from "node:process"
// console.log(version);

const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/(Dashboard|UserList|Calendar|api\/test|ScheduleList|ScheduleTable)",
                destination: "/",
            },
            {
                source: "/ScheduleList/:id",
                destination: "/",
            },
            {
                source: "/ScheduleTable/:id",
                destination: "/",
            }
        ]
    },
    // publicRuntimeConfig: {
    //     version: "0.1.0",
    // },
};

export default nextConfig;
