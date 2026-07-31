import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // stray lockfile in the user folder makes Next guess the wrong workspace root
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
