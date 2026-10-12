import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [new URL("https://img.clerk.com/**")],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
