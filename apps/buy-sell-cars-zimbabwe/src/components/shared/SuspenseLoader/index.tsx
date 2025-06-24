import { BeatLoader } from "react-spinners";
import { Typography } from "~bsc-shared/ui";
import { tokens } from "@/src/styles/theme";
import { Flex } from "@/styled-system/jsx";

export const SuspenseLoader = ({ label }: { label?: string }) => (
  <Flex justifyContent="center" alignItems="center" height="100vh" gap="md">
    {label && (
      <Typography variant="h4" align="center">
        {label}
      </Typography>
    )}
    <BeatLoader
      size={15}
      speedMultiplier={1.5}
      color={tokens.colors.primary.value}
    />
  </Flex>
);
