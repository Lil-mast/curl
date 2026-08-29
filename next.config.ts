import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ["antd", "@ant-design/icons", "@ant-design/nextjs-registry"],
  turbopack: {
    root: path.resolve(__dirname)
  }
};

export default nextConfig;
