import { defineConfig, type Options } from "tsup";

const isWatch = process.argv.includes("--watch");
export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["cjs"],
  esbuildOptions(esOptions) {
    if (!isWatch) {
      esOptions.define = {
        "process.env.NODE_ENV": JSON.stringify("production"),
      };
    }
  },
  ...options,
}));
