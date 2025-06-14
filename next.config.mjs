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
    // webpack: (
    //     config,
    //     { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    //     ) => {
    //         // console.log(`start: \n`, config, dev, isServer, nextRuntime, webpack)
    //         // Important: return the modified config
    //         return config
    // },
    // publicRuntimeConfig: {
    //     version: "0.1.0",
    // },
};

export default nextConfig;
