// import js from "@eslint/js";
// import globals from "globals";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs}"],
//     plugins: { js },
//     extends: ["js/recommended"],
//     languageOptions: { globals: globals.browser },
//   },
// ]);
import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs}'],
    ignores: ['node_modules', 'dist', 'build'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      // Code quality
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-undef': 'error',

      // Best practices (good for backend)
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',

      // Style (clean professional)
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'never']
    }
  }
]);
