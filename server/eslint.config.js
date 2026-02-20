import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs}"],
    ignores: ["node_modules", "dist", "build"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Only the rules you asked for
      quotes: ["error", "double"],
      indent: ["error", 2],
      // "no-console": "warn",
      // "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);
