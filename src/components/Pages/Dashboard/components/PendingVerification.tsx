import React from "react";
import Link from "next/link";
import { Typography } from "@/src/components/ui";
import { ResponsiveContainer } from "@/src/components/ui";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { Box, Flex } from "@/styled-system/jsx";

export const PendingVerification = () => {
  return (
    <ResponsiveContainer>
      <Flex
        marginX="auto"
        maxWidth="60rem"
        direction="column"
        padding="xl"
        gap="md"
      >
        <Typography color="primary" variant="h2" align="center">
          Your Account is being verified
        </Typography>

        <Typography align="center">
          We are currently reviewing your account details. Please check back
          once notified to list your vehicles. In the meantime, you can{" "}
          <Typography
            color="primary"
            as="span"
            hoverEffect="color"
            weight="bold"
          >
            <Link href="/dashboard/security">update your password</Link>
          </Typography>{" "}
          or check out our{" "}
          <Typography
            color="primary"
            as="span"
            hoverEffect="color"
            weight="bold"
          >
            <Link href="/dashboard/subscriptions/">subscription plans.</Link>
          </Typography>
        </Typography>

        <Box marginTop="xl">
          <Typography align="center">
            If you have any questions, please contact our support team at{" "}
            <Link
              href={`${SOCIAL_MEDIA_URLS.email}?subject=Account%20Verification`}
              target="_blank"
              rel="noopener noreferrer"
              title="Email us for support"
            >
              <Typography
                as="span"
                color="primaryDark"
                weight="bold"
                hoverEffect="color"
              >
                {SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Flex>
    </ResponsiveContainer>
  );
};
