import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript: {
    ignoreBuildErrors: true,  // DISABLES blocking build errors for typescript
  },
};

export default nextConfig;
