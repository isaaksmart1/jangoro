import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths({ root: __dirname }), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ["antd"],
        },
      },
    },
  },
  server: {
    host: true, // Allows external access
    port: 3000, // Change if needed
    strictPort: true,
  },
  preview: {
    allowedHosts: ["app.jangoro.com"],
  },
});
