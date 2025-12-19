import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // add '@' alias to project root — change ' .' to 'src' if you want alias to point to /src
      "@": path.resolve(__dirname, "."),
    };
    return config;
  },
};

export default nextConfig;
