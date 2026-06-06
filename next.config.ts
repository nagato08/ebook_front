import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autonome pour Docker (image legere avec server.js).
  output: "standalone",
};

export default nextConfig;
