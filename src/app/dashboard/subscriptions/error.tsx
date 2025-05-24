"use client";

import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "@/src/components/ErrorBoundary";

const Error = ({ error, reset }: ErrorBoundaryProps) => (
  <ErrorBoundary error={error} reset={reset} />
);

export default Error;
