'use client';

import { useEffect } from 'react';

import { ResponsiveContainer, Typography, Button } from '../ui';
import { Stack } from '@/styled-system/jsx';

export interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  message?: string;
}

export const ErrorBoundary = ({
  error,
  reset,
  message,
}: ErrorBoundaryProps) => {
  useEffect(() => {
    console.error('Error in ErrorBoundary:', error);
  }, [error]);

  return (
    <ResponsiveContainer padding="lg" maxWidth="sm">
      <Stack gap="lg">
        <Typography as="h2" align="center">
          {message ? message : 'Hmmm, Something went wrong!'}
        </Typography>
        <Typography as="h4" align="center">
          &quot;{error.message}&quot;
        </Typography>

        <Button onClick={() => reset()}>Try again!</Button>
      </Stack>
    </ResponsiveContainer>
  );
};
