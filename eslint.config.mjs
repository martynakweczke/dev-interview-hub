import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

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

      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: [],
          distinctGroup: false,
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportDeclaration[source.value='react'] > ImportNamespaceSpecifier",
          message:
            'Import from "react" by name, e.g. import { useState } from "react".',
        },
        {
          selector:
            "ImportDeclaration[source.value='react'] > ImportDefaultSpecifier",
          message:
            'Import from "react" by name, e.g. import { useState } from "react".',
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
