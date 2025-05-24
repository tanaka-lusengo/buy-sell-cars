"use client";

import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "@/src/components/ErrorBoundary";

const Error = ({ error }: ErrorBoundaryProps) => (
  <ErrorBoundary
    error={error}
    message={
      "Hmmm, looks like an error occurred while signing up. Please try again."
    }
  />
);

export default Error;
