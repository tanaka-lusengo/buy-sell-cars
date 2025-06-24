"use client";

import { ErrorBoundary } from "~bsc-shared/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "~bsc-shared/components/ErrorBoundary";

const Error = ({ error }: ErrorBoundaryProps) => (
  <ErrorBoundary error={error} />
);

export default Error;
