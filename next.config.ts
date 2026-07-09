import type { NextConfig } from "next";
import { build } from "velite";

class VeliteWebpackPlugin {
  static initialBuild?: Promise<unknown>;
  static watchStarted = false;

  apply(compiler: any) {
    const isDev = compiler.options.mode === "development";

    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      VeliteWebpackPlugin.initialBuild ??= build({
        watch: false,
        clean: !isDev,
      });

      await VeliteWebpackPlugin.initialBuild;

      if (isDev && !VeliteWebpackPlugin.watchStarted) {
        VeliteWebpackPlugin.watchStarted = true;
        build({ watch: true, clean: false });
      }
    });
  }
}

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;
