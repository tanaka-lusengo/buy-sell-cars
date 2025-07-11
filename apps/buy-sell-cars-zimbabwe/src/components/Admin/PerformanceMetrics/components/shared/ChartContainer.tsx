import React from "react";
import { Box } from "@/styled-system/jsx";
import { MAX_HEIGHT } from "../../constants";

export const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    width="100%"
    padding="md"
    maxHeight={MAX_HEIGHT}
    overflowY="auto"
    border="1px solid"
    borderColor="grey"
    borderRadius="1.2rem"
    boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
    transition="0.3s ease-in-out"
    _hover={{
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
    }}
  >
    {children}
  </Box>
);
