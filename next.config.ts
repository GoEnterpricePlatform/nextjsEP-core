import type { NextConfig } from "next";

const isDev = process.env.NEXT_PUBLIC_NODE_ENV !== "prod";

// Default values used only in development
// Port 9000 → MinIO default port
const devDefaults = {
  protocol: "http" as "http" | "https",
  hostname: "localhost",
  port: "9000",
  pathname: "/**",
};

// In production, all values must come from environment variables
const prodConfig = {
  protocol: process.env.IMG_PROTOCOL as "http" | "https",
  hostname: process.env.IMG_HOST,
  port: process.env.IMG_PORT,
  pathname: process.env.IMG_PATH,
};

// Final configuration selection
const cfg = isDev ? devDefaults : prodConfig;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: cfg.protocol,
        hostname: cfg.hostname || "",
        port: cfg.port || "",
        pathname: cfg.pathname || "/**",
      },
    ],
  },
};

export default nextConfig;
