import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 4002,
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:8070",
      },
      files: {
        target: "http://127.0.0.1:8070",
      },
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    outDir: "../backend/dist",
  },
});
