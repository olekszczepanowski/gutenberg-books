import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gutenberg.org",
        port: "",
        pathname: "/cache/epub/**",
      },
    ],
  },
};

export default nextConfig;
