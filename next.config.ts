import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashing-schnauzer-2.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "spotted-crocodile-938.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
