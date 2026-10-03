import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://ephorsys-crm-backend.onrender.com",
        // target: "http://localhost:8800",
        changeOrigin: true,
        secure: true,
        // secure: false,
      },
    },
  },
});
