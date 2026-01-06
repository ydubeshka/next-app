import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Это правило требует пустую строку перед return, после импортов и между классами/функциями
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "function", "next": "function" },
        { "blankLine": "always", "prev": "import", "next": "function" },
        { "blankLine": "always", "prev": "multiline-const", "next": "function" }
      ]
    }
  },

    eslintConfigPrettier,
]);

export default eslintConfig;
