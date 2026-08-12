import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin explicitly: an unrelated package-lock.json in the Windows user home
  // directory otherwise makes Next.js infer the wrong workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
