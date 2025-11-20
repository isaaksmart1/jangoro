import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginImport from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        // project: ["./tsconfig.json"], // uncomment if you need type-aware linting
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
        // To disable react/react-in-jsx-scope for React 17+
        pragma: "React", // default to React
        fragment: "Fragment", // default to Fragment
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // Disable react/react-in-jsx-scope for React 17+
      "react/react-in-jsx-scope": "off",
      // Disable react/prop-types for TypeScript projects
      "react/prop-types": "off",
      // Add a rule to handle the JSX transform if needed, though 'detect' usually handles it
      "react/jsx-uses-react": "off",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: pluginImport,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@ant-design"],
            ["^@refinedev"],
            ["^@?\\w"],
            ["^"],
            ["^\\."],
            ["^\\u0000"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_"}], // Allow unused vars if prefixed with _
    },
  },
  prettierConfig,
  {
    ignores: [
      "dist",
      "node_modules",
      ".*/**",
      "coverage",
      "public",
      "build",
      "*.json",
      "*.md",
      "**/*.config.js",
      "**/*.config.cjs",
      "**/*.config.ts",
      "*.d.ts"
    ],
  },
];