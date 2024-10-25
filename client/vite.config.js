import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// This is how to set __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Create an alias for the src folder
    },
  },
});
