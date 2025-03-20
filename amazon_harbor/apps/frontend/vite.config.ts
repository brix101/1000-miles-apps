import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";

const defaultConfig = {
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

const ZULU_LIVE = process.env.ZULU_LIVE;
const API_LIVE = process.env.API_LIVE;

console.log(ZULU_LIVE);
export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    // const isDev = mode === "development";

    return {
      ...defaultConfig,
      server: {
        proxy: {
          "/api": {
            target: API_LIVE,
          },
          "/zulu": {
            target: `${ZULU_LIVE}/api`,
            rewrite: (p) => p.replace(/^\/zulu/, ""),
          },
        },
      },
    };
  } else {
    return defaultConfig;
  }
});
