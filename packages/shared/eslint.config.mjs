import config from "eslint-config-custom";

// Override the config for shared package since it doesn't have pages directory
const sharedConfig = [
  ...config,
  {
    rules: {
      // Disable the no-html-link-for-pages rule since this package doesn't have pages
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default sharedConfig;
