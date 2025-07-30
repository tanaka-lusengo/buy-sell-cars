import React from "react";
import { H4, P } from "~bsc-shared/ui";
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
    <H4>{title}</H4>
    <P>{subtitle}</P>
  </VStack>
);
