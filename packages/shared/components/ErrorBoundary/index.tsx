"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Stack } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography, Button } from "../../ui";

export interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  message?: string;
}

export const ErrorBoundary = ({ error, message }: ErrorBoundaryProps) => {
  useEffect(() => {
    console.error("Error in ErrorBoundary:", error);
  }, [error]);

  const router = useRouter();

  return (
    <ResponsiveContainer padding="lg" maxWidth="sm">
      <Stack gap="lg">
        <Typography as="h2" align="center">
          {message ? message : "Hmmm, Something went wrong!"}
        </Typography>
        <Typography as="h4" align="center">
          Please try again later or contact support if the issue persists.
        </Typography>

        <Box display="flex" justifyContent="center" gap="lg">
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </Box>
      </Stack>
    </ResponsiveContainer>
  );
};
