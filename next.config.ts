import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    // Option to disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.9854.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "9854.me",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
