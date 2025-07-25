import React from "react";
import Link from "next/link";
import { Typography, ResponsiveContainer } from "~bsc-shared/ui";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { Box, Flex } from "@/styled-system/jsx";

export const PendingVerification = () => {
  return (
    <ResponsiveContainer>
      <Flex
        marginX="auto"
        maxWidth="65rem"
        direction="column"
        padding="xl"
        gap="md"
      >
        <Typography color="primary" variant="h2" align="center">
          Your Account is being verified
        </Typography>

        <Typography align="center">
          We are currently reviewing your account details. This may take up to
          24hrs. Please check back once notified via email to list your
          vehicles. In the meantime, you can{" "}
          <Typography
            as="span"
            color="primary"
            hoverEffect="color"
            weight="bold"
          >
            <Link href="/dashboard/security">update your password</Link>
          </Typography>{" "}
          or check out{" "}
          <Typography
            as="span"
            color="primary"
            hoverEffect="color"
            weight="bold"
          >
            <Link href="/dashboard/subscriptions/">subscription plans.</Link>
          </Typography>
        </Typography>

        <Box marginTop="xl">
          <Typography align="center">
            If you have any questions, please contact our support team at:
          </Typography>

          <Typography
            color="primaryDark"
            weight="bold"
            hoverEffect="color"
            align="center"
          >
            <Link
              href={`${SOCIAL_MEDIA_URLS.email}?subject=Account%20Verification`}
              target="_blank"
              rel="noopener noreferrer"
              title="Email us for support"
            >
              {SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}
            </Link>
          </Typography>
        </Box>
      </Flex>
    </ResponsiveContainer>
  );
};
