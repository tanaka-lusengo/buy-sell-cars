import { defineConfig } from '@pandacss/dev';

export const theme = {
  extend: {
    tokens: {
      fonts: {
        heading: { value: 'Satoshi, sans-serif' },
        body: { value: 'Erode, sans-serif' },
      },
    },
  },
};

export const globalCss = {
  body: {
    fontFamily: 'body',
  },
  'h1,h2,h3,h4,h5,h6': {
    fontFamily: 'heading',
  },
};

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  include: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  exclude: [],
  theme,
  globalCss,
  presets: ['@pandacss/preset-base'],
  jsxFramework: 'react',
  outdir: 'styled-system',
});
