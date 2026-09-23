import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  prettier,

  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      curly: ["error", "all"],

      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "block-like", next: "*" },
      ],

      eqeqeq: ["error", "always"],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
