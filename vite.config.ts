import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
import { fileURLToPath } from "url";

// Definir el tipo de las variables de entorno
interface EnvConfig {
  VITE_APP_DOMAIN: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "") as unknown as EnvConfig;

  return {
    plugins: [vue(),tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_APP_DOMAIN,
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
          manualChunks(id: string) {
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