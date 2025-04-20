import { styled } from '@/styled-system/jsx';

export const Header = styled('header', {
  base: {
    position: 'relative',
    width: '100%',
    marginX: 'auto',
    py: 'md',
    px: 'lg',
    backgroundColor: 'transparent',
  },
});

export const Nav = styled('nav', {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginX: 'auto',
  },
});

export const NavList = styled('ul', {
  base: {
    display: { base: 'none', xl: 'flex' },
    gap: '2rem',
  },
});
