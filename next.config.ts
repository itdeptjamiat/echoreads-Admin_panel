import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    AUTH_API_URL: process.env.AUTH_API_URL,
  },
  // Ensure environment variables are loaded
  experimental: {
    // This ensures environment variables are available
  },
};

export default nextConfig;
