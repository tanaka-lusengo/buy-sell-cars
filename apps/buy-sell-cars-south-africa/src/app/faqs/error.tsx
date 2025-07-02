"use client";

import { ErrorBoundary } from "~bsc-shared/components/ErrorBoundary";
import { type ErrorBoundaryProps } from "~bsc-shared/components/ErrorBoundary";

const Error = ({ error }: ErrorBoundaryProps) => (
  <ErrorBoundary
    error={error}
    message={
      "Hmmm, looks like an error occurred while loading FAQs. Please try again later."
    }
  />
);

export default Error;
