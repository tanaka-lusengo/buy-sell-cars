import React from "react";
import { Typography } from "~bsc-shared/ui";
import { Box } from "@/styled-system/jsx";

type ChartHeaderProps = {
  title: string;
  subtitle?: string;
};

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  subtitle,
}) => (
  <Box marginBottom="md">
    <Typography variant="h3">{title}</Typography>
    {subtitle && <Typography>{subtitle}</Typography>}
  </Box>
);
