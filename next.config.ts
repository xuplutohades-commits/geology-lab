import type { NextConfig } from "next";

// 发布到 GitHub Pages 子路径时：BASE_PATH=gh npm run build
// 本地/任意静态服务器：直接 npm run build（根路径）
const isGh = process.env.BASE_PATH === "gh";
const base = isGh ? "/geology-lab" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGh ? base : undefined,
  assetPrefix: isGh ? base : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
