import { defineConfig } from "@pandacss/dev";
import { globalCss, tokens, textStyles, breakpoints } from "~bsc-shared/styles";

export default defineConfig({
  preflight: true,
  include: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.{js,jsx,ts,tsx}",
    "../../packages/shared/ui/**/*.{js,jsx,ts,tsx}",
    "../../packages/shared/components/**/*.{js,jsx,ts,tsx}",
    "../../packages/shared/styles/**/*.{js,jsx,ts,tsx}",
  ],
  exclude: [],
  globalCss,
  theme: {
    extend: {
      tokens,
      textStyles,
      breakpoints,
    },
  },
  presets: ["@pandacss/preset-base"],
  jsxFramework: "react",
  outdir: "styled-system",
});
