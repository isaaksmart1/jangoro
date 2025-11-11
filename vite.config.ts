import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths({ root: __dirname }), react(), tailwindcss()],
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
    port: 4173, // Change if needed
    strictPort: true,
    allowedHosts: ["app.jangoro.com"],
  },
  preview: {
    allowedHosts: ["app.jangoro.com"],
  },
  // optimizeDeps: {
  //   exclude: ["@refinedev/react-router", "antd"],
  // },
});
