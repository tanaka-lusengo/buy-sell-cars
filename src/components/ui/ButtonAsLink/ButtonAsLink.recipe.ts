import { cva } from '@/styled-system/css';

export const buttonAsLinkRecipe = cva({
  base: {
    fontFamily: 'body',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: '2px solid transparent',
  },
  variants: {
    fontWeight: {
      normal: { fontWeight: 'normal' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },
    hoverEffect: {
      color: {
        _hover: {
          transition: 'all 0.2s ease-in-out',
          color: 'primaryDark',
        },
      },
    },
    textDecoration: {
      underline: {
        borderBottom: '2px solid',
        borderColor: 'primary',
        _hover: {
          transition: 'all 0.2s ease-in-out',
          color: 'primaryDark',
          borderColor: 'transparent',
        },
      },
    },
  },
  defaultVariants: {
    fontWeight: 'medium',
  },
});
