"use client";

import { ErrorBoundary } from "~bsc-shared/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "~bsc-shared/components/ErrorBoundary";

const Error = ({ error }: ErrorBoundaryProps) => (
  <ErrorBoundary
    error={error}
    message={"Hmmm, looks like an error occurred. Please try again."}
  />
);

export default Error;
