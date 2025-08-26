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
        hostname: "s3.golu.codes",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "golu.codes",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
