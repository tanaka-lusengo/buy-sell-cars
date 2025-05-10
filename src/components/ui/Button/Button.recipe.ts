import { cva } from '@/styled-system/css';

export const buttonRecipe = cva({
  base: {
    fontFamily: 'body',
    fontWeight: 'medium',
    borderRadius: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    px: 'md',
    py: 'sm',
    _focus: {
      outline: 'none',
      ring: '2px',
      ringColor: 'primary',
    },
    _disabled: {
      opacity: 0.6,
      backgroundColor: 'grey',
      _hover: {
        backgroundColor: 'grey',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'primary',
        color: 'white',
        _hover: {
          bg: 'primaryDark',
        },
      },
      secondary: {
        bg: 'secondary',
        color: 'text',
        _hover: {
          bg: 'grey',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'primary',
        border: '1px solid',
        borderColor: 'primary',
        _hover: {
          bg: 'primary',
          color: 'white',
        },
      },
      upload: {
        bg: 'transparent',
        border: '2px dashed',
        borderColor: 'grey',
        _hover: {
          borderColor: 'primaryDark',
        },
      },
    },
    size: {
      sm: {
        fontSize: 'body2',
        px: 'sm',
        py: 'xs',
      },
      md: {
        fontSize: 'body1',
        px: 'md',
        py: 'sm',
      },
      lg: {
        fontSize: 'h5',
        px: 'lg',
        py: 'md',
      },
    },
    fontWeight: {
      normal: { fontWeight: 'normal' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
