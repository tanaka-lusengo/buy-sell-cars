import { defineGlobalStyles } from '@pandacss/dev';
import { tokens } from './index';

const { fonts, fontSizes } = tokens;

export const globalCss = defineGlobalStyles({
  html: {
    fontSize: '62.5%', // make 1rem = 10px
  },
  body: {
    fontFamily: fonts.body.value,
    fontSize: fontSizes.body1.value,
    lineHeight: '1.5',
    WebkitFontSmoothing: 'auto',
  },
  'p,h1,h2,h3,h4,h5,h6': {
    overflowWrap: 'break-word',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  li: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '*,*::before,*::after': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },
  // Improve media defaults
  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%',
  },
  // Remove built-in form typography styles
  'input, button, textarea, select': {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
});
