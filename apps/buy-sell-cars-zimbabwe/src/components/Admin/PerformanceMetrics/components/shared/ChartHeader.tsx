import { Typography } from "~bsc-shared/ui";
import { Box } from "@/styled-system/jsx";

export const ChartHeader = ({ title }: { title: string }) => (
  <Box marginBottom="md">
    <Typography variant="h3">{title}</Typography>
  </Box>
);
