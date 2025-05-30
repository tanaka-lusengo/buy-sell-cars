"use client";

import { useRouter } from "next/navigation";

import { signOut } from "@/src/server/actions/auth";
import { ButtonAsLink } from "@/src/components/ui";
import { Box, Flex } from "@/styled-system/jsx";
import { generateIcon } from "@/src/utils";

export const SignOut = ({ showIcon = true }: { showIcon?: boolean }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Flex justifyContent="flex-start" align="center" gap="md">
      {showIcon && <Box width="2rem">{generateIcon("right-from-bracket")}</Box>}
      <ButtonAsLink hoverEffect="color" onClick={handleLogout}>
        Sign Out
      </ButtonAsLink>
    </Flex>
  );
};
