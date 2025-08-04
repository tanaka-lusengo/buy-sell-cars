"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Stack } from "@/styled-system/jsx";
import { ResponsiveContainer, Button, H2, H4 } from "../../ui";

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
        <H2 align="center">
          {message ? message : "Hmmm, Something went wrong!"}
        </H2>
        <H4 align="center">
          Please try again later or contact support if the issue persists.
        </H4>

        <Box display="flex" justifyContent="center" gap="lg">
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </Box>
      </Stack>
    </ResponsiveContainer>
  );
};
