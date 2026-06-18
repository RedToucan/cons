import type { NextConfig } from "next";
import { build } from "velite";

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler: any) {
    if (VeliteWebpackPlugin.started) return;
    VeliteWebpackPlugin.started = true;
    const isDev = compiler.options.mode === "development";
    build({ watch: isDev, clean: !isDev });
  }
}

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;
