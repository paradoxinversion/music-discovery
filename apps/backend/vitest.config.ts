import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./vitest-setup.ts",
    fileParallelism: false,
    coverage: {
      provider: "istanbul",
      reporter: ["text", ["lcov", { projectRoot: "./src" }]],
      reportsDirectory: "./coverage",
      reportOnFailure: true,
    },
  },
});
