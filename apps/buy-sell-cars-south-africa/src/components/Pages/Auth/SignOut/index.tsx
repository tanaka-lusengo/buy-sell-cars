"use client";

import { useRouter } from "next/navigation";
import { Typography } from "~bsc-shared/ui";
import { generateIcon } from "~bsc-shared/utils";
import { signOut } from "@/src/server/actions/auth";
import { Box, Flex } from "@/styled-system/jsx";

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
      <Box onClick={handleLogout} role="button" style={{ cursor: "pointer" }}>
        <Typography variant={variant} weight="bold" hoverEffect="color">
          Sign Out
        </Typography>
      </Box>
    </Flex>
  );
};
