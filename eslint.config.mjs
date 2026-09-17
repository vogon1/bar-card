import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: js.configs.recommended
});

export default [
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: "@typescript-eslint/parser",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-extra-semi": "error",
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended"),
];
