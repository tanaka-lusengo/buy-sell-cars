"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, Typography, Button, ButtonAsLink } from "../ui";
import { Box, Stack } from "@/styled-system/jsx";

export interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  message?: string;
}

export const ErrorBoundary = ({ error, message }: ErrorBoundaryProps) => {
  useEffect(() => {
    console.error("Error in ErrorBoundary:", error);
  }, [error]);

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const handleReset = () => {
    router.refresh();
  };

  return (
    <ResponsiveContainer padding="lg" maxWidth="sm">
      <Stack gap="lg">
        <Typography as="h2" align="center">
          {message ? message : "Hmmm, Something went wrong!"}
        </Typography>
        <Typography as="h4" align="center">
          &quot;{error.message}&quot;
        </Typography>

        <Button onClick={handleReset}>Try again!</Button>
        <Box display="flex" justifyContent="center">
          <ButtonAsLink textDecoration="underline" onClick={handleGoBack}>
            Go back
          </ButtonAsLink>
        </Box>
      </Stack>
    </ResponsiveContainer>
  );
};
