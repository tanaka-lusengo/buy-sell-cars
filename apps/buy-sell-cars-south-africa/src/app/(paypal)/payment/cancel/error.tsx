"use client";

import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "@/src/components/ErrorBoundary";

const Error = ({ error }: ErrorBoundaryProps) => (
  <ErrorBoundary
    error={error}
    message={
      "An error occurred while canceling your payment. Please try again or contact support if the issue persists."
    }
  />
);

export default Error;
