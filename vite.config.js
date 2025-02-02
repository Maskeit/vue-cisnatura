import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  let env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), visualizer({ open: true }), compression()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_APP_DOMAIN, // Usa la variable de entorno
          changeOrigin: true,
          secure: false,
          credentials: "include",
        },
      },
      cors: {
        origin: env.VITE_APP_DOMAIN,
        credentials: true,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@tiptap")) return "tiptap";
              return "vendor";
            }
          },
        },
      },
      optimizeDeps: {
        include: ["@tiptap/core", "@tiptap/extension-paragraph"],
        exclude: ["@tiptap/starter-kit"],
      },
    },
  };
});
