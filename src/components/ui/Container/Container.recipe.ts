import { cva } from '@/styled-system/css';

export const containerRecipe = cva({
  base: {
    width: '100%',
    marginX: 'auto',
    backgroundColor: 'transparent',
    maxWidth: { sm: 'pageSm', md: 'pageMd', lg: 'pageLg', xl: 'pageXl' },
  },
  variants: {
    margin: {
      xxs: { margin: 'xxs' },
      xs: { margin: 'xs' },
      sm: { margin: 'sm' },
      md: { margin: 'md' },
      lg: { margin: 'lg' },
      xl: { margin: 'xl' },
      xxl: { margin: 'xxl' },
    },
    padding: {
      xxs: { padding: 'xxs' },
      xs: { padding: 'xs' },
      sm: { padding: 'sm' },
      md: { padding: 'md' },
      lg: { padding: 'lg' },
      xl: { padding: 'xl' },
      xxl: { padding: 'xxl' },
    },
    maxWidth: {
      unset: {},
      sm: { maxWidth: 'pageSm' },
      md: { maxWidth: 'pageMd' },
      lg: { maxWidth: 'pageLg' },
      xl: { maxWidth: 'pageXl' },
    },
  },
});
