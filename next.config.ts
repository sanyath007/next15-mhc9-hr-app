import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    basePath: "/app",
    // distDir: "build",
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
