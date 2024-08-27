import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import env from "vite-plugin-env-compatible";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reportsDirectory: "./tests/coverage",
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("test"),
  },
  plugins: [env()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
