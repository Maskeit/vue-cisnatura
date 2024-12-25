import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// Configura __dirname en ES Modules
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://cisnaturatienda.local",
        changeOrigin: true,
        secure: false,
        credentials: "include", // Permitir cookies
      },
    },
    cors: {
      origin: "http://localhost:5173",
      credentials: true, // Permitir cookies en solicitudes entre sitios
    },
  },
});
