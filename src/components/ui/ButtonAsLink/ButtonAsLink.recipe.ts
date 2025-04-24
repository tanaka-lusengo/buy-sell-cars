import { cva } from '@/styled-system/css';

export const buttonAsLinkRecipe = cva({
  base: {
    fontFamily: 'body',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: '2px solid transparent',
    _hover: {
      borderBottom: '2px solid',
      borderBottomColor: 'primary',
    },
  },
  variants: {
    fontWeight: {
      normal: { fontWeight: 'normal' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },
  },
  defaultVariants: {
    fontWeight: 'medium',
  },
});
