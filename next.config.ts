import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  eslint: {
    // Option to disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["s3.golu.codes" , "golu.codes"], // Add your MinIO domain here
  },
};

export default nextConfig;
