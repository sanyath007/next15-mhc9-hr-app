import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default (nextPhase: string) => {
    const nextConfig: NextConfig = {
        /* config options here */
        // basePath: "/app",
        // distDir: "build",
        output: "standalone",
        // assetPrefix: nextPhase === PHASE_DEVELOPMENT_SERVER ? "" : "/app/",
        eslint: {
            ignoreDuringBuilds: true,
        },
    };

    return nextConfig;
}