import React from "react";
import { Typography } from "~bsc-shared/ui";
import { VStack } from "@/styled-system/jsx";

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle = "Come back later to check!",
}) => (
  <VStack alignItems="center" gap="md">
    <Typography variant="h4">{title}</Typography>
    <Typography>{subtitle}</Typography>
  </VStack>
);
