import type { NextConfig } from "next";
import { build } from "velite";

type Compiler = {
  options: {
    mode?: string;
  };
  hooks: {
    beforeCompile: {
      tapPromise(name: string, callback: () => Promise<void>): void;
    };
  };
};

class VeliteWebpackPlugin {
  static initialBuild?: Promise<unknown>;
  static watchStarted = false;

  apply(compiler: Compiler) {
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
  async redirects() {
    return [
      {
        source: "/posts/where-does-campus-anger-come-from",
        destination: "/posts/campus-liberals-anger-easily",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;
