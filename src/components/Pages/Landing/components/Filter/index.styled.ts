import { styled } from '@/styled-system/jsx';

export const Form = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'sm',
    width: '100%',
    maxWidth: '40 rem',
    border: '1px solid white',
    borderRadius: '1rem',
    padding: 'md',
    backgroundColor: 'white',
  },
});
