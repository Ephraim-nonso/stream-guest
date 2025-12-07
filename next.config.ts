import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@reown/appkit",
    "@reown/appkit-adapter-wagmi",
    "@reown/appkit-react",
    "wagmi",
    "viem",
  ],
  webpack: (config) => {
    // Exclude problematic packages as per AppKit Next.js documentation
    // https://docs.reown.com/appkit/next/core/installation
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push("pino-pretty", "lokijs", "encoding");
    } else {
      config.externals = [
        config.externals,
        "pino-pretty",
        "lokijs",
        "encoding",
      ];
    }

    // Exclude guest-contracts and backend directories from webpack processing
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: [
        /node_modules/,
        /guest-contracts/,
        /backend/,
        /overview/,
      ],
    });

    // Optional wallet connector dependencies are now installed
    // No need to alias them to false anymore

    return config;
  },
  // Exclude problematic packages from server-side rendering
  serverExternalPackages: ["pino", "pino-pretty"],
  // Add empty turbopack config to allow webpack config
  turbopack: {},
};

export default nextConfig;
