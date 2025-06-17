"use client";

import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "@/src/components/ErrorBoundary";

const Error = ({ error }: ErrorBoundaryProps) => (
  <ErrorBoundary error={error} />
);

export default Error;
