import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    basePath: "",
    distDir: "build",
    // output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
