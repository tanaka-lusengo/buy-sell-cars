import { H3 } from "~bsc-shared/ui";
import { Box } from "@/styled-system/jsx";

export const ChartHeader = ({ title }: { title: string }) => (
  <Box marginBottom="md">
    <H3>{title}</H3>
  </Box>
);
