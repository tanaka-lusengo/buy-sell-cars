import { BeatLoader } from "react-spinners";
import { tokens } from "~bsc-shared/styles";
import { H4 } from "~bsc-shared/ui";
import { Flex } from "@/styled-system/jsx";

export const SuspenseLoader = ({ label }: { label?: string }) => (
  <Flex justifyContent="center" alignItems="center" height="100vh" gap="md">
    {label && <H4 align="center">{label}</H4>}
    <BeatLoader
      size={15}
      speedMultiplier={1.5}
      color={tokens.colors.primary.value}
    />
  </Flex>
);
