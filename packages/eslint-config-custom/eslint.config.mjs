import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const eslintConfig = [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
    "next/typescript",
  ),
  {
    rules: {
      // Code style
      semi: ["error", "always"],
      "prettier/prettier": "error",

      // TypeScript best practices
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",

      // React best practices
      "react/react-in-jsx-scope": "off", // not needed with Next.js
      "react/prop-types": "off", // not needed with TS,

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Rest of the rules
      "object-shorthand": ["error", "always"],
    },
  },
];

export default eslintConfig;
