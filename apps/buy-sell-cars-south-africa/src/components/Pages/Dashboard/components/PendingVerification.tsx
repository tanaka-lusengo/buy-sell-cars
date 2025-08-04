import React from "react";
import Link from "next/link";
import { ResponsiveContainer, H2, P, Span } from "~bsc-shared/ui";
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
        <H2 color="primary" align="center">
          Your Account is being verified
        </H2>

        <P align="center">
          We are currently reviewing your account details. This may take up to
          24hrs. Please check back once notified via email to list your
          vehicles. In the meantime, you can{" "}
          <Span color="primary" hoverEffect="color" weight="bold">
            <Link href="/dashboard/security">update your password</Link>
          </Span>{" "}
          or check out{" "}
          <Span color="primary" hoverEffect="color" weight="bold">
            <Link href="/dashboard/subscriptions/">subscription plans.</Link>
          </Span>
        </P>

        <Box marginTop="xl">
          <P align="center">
            If you have any questions, please contact our support team at:
          </P>

          <P
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
          </P>
        </Box>
      </Flex>
    </ResponsiveContainer>
  );
};
