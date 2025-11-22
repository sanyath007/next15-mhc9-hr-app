import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

// const isDev =  phase === PHASE_DEVELOPMENT_SERVER;

const nextConfig: NextConfig = {
    /* config options here */
    basePath: "/app",
    // distDir: "build",
    output: "standalone",
    // assetPrefix: isDev ? undefined : '/app/',
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
