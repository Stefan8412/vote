import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  build: {
    rollupOptions: {
      external: ["react-syntax-highlighter"],
    },
  },
  plugins: [react()],
});
