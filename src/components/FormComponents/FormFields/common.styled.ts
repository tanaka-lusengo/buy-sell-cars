import { styled } from '@/styled-system/jsx';

export const ErrorText = styled('p', {
  base: {
    color: 'error',
  },
});

export const InputContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'xs',
    width: '100%',
    marginX: 'auto',
  },
});

export const Label = styled('label', {
  base: {
    fontSize: 'body1',
  },
});

export const InputField = styled('input', {
  base: {
    cursor: 'text',
    padding: 'sm',
    border: '2px solid',
    borderColor: 'grey',
    borderRadius: '1.2rem',
    transition: 'border-color 0.2s ease-in-out',
    _focusVisible: {
      outline: 'none',
      borderColor: 'primary',
    },
  },
});

export const SelectField = styled('select', {
  base: {
    cursor: 'pointer',
    padding: 'sm',
    height: '4.7rem',
    border: '2px solid',
    borderColor: 'grey',
    borderRadius: '1.2rem',
    _focusVisible: {
      outline: 'none',
      borderColor: 'primary',
    },
  },
});

export const TextareaField = styled('textarea', {
  base: {
    padding: 'sm',
    border: '2px solid',
    borderColor: 'grey',
    borderRadius: '1.2rem',
    _focusVisible: {
      outline: 'none',
      borderColor: 'primary',
    },
  },
});
