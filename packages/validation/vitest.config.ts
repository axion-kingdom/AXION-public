import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  css: false,
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
