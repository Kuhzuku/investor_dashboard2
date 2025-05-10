import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // ensures it uses your project root (where index.html is)
  build: {
    outDir: "build", // Netlify expects this
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "localhost",
      "ef2310c3-12a4-4304-96eb-89f57706a822-00-10mmbkz84aevs.spock.replit.dev",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
