import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint : {
    ignoreDuringBuilds:true
  },
  typescript : {
    ignoreBuildErrors: true,  // DISABLES blocking build errors for typescript
  },
  images : {
    domains : ["res.cloudinary.com"]
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, 
    };
    return config;
  },
};

export default nextConfig;
