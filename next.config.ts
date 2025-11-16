import type { NextConfig } from "next";

const nextConfig = {
    /* config options here */
    reactCompiler: true,
    poweredByHeader: false,
    // compiler: {
    //     removeConsole: {
    //         exclude: ["error"],
    //   },

    // },
} satisfies NextConfig;

export default nextConfig;
