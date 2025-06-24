/** @type {import("prettier").Config} */
const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react$", // React first
    "<THIRD_PARTY_MODULES>", // All other node_modules
    "^~bsc-shared/.*$", // Custom alias for shared code
    "^@/.*$", // Next.js internal alias (optional)
    "^[./]", // Then relative imports
  ],
  semi: true,
  tabWidth: 2,
  trailingComma: "es5",
  arrowParens: "always",
};

export default config;
