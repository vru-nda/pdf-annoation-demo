/** @type {import('next').NextConfig} */
import path from "path";
const __dirname = path.resolve();

const nextConfig = {
  // webpack: (
  //   config,
  //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  // ) => {
  //   config.externals.push({ canvas: "commonjs canvas" });
  //   return config;
  // },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.pdf/,
      type: "asset/resource",
      generator: {
        filename: "static/[hash][ext]",
      },
    });
    config.externals.push({ canvas: "commonjs canvas" });

    return config;
  },
  output: { path: path.resolve(__dirname, "static") },
};

export default nextConfig;
