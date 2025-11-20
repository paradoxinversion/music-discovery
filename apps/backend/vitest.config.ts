import { defineConfig, configDefaults } from "vitest/config";

const excludePatterns = ["**/node_modules/**", "**/dist/**", "**/docs/**"];

export default defineConfig({
  test: {
    setupFiles: "./vitest-setup.ts",
    exclude: [...excludePatterns],
    fileParallelism: false,
    coverage: {
      provider: "istanbul",
      reporter: ["text", ["lcov", { projectRoot: "./src" }]],
      reportsDirectory: "./coverage",
      reportOnFailure: true,
      exclude: [...excludePatterns, ...configDefaults.coverage.exclude!],
    },
  },
});
