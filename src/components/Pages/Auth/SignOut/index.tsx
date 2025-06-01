"use client";

import { useRouter } from "next/navigation";

import { signOut } from "@/src/server/actions/auth";
import { Typography } from "@/src/components/ui";
import { Box, Flex } from "@/styled-system/jsx";
import { generateIcon } from "@/src/utils";

export const SignOut = ({
  showIcon = true,
  variant = "h4",
}: {
  showIcon?: boolean;
  variant?: "h4" | "body1";
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Flex justifyContent="flex-start" align="center" gap="md">
      {showIcon && <Box width="2rem">{generateIcon("right-from-bracket")}</Box>}
      <Box onClick={handleLogout}>
        <Typography variant={variant} weight="bold" hoverEffect="color">
          Sign Out
        </Typography>
      </Box>
    </Flex>
  );
};
