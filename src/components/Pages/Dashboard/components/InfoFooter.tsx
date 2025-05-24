import Link from "next/link";
import { Flex } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";

export const InfoFooter = ({
  color = "text",
}: {
  color?: "white" | "text";
}) => {
  return (
    <Flex
      height="fit-content"
      direction="column"
      alignItems="center"
      gap="xs"
      marginTop="lg"
    >
      <Typography align="center" color={color}>
        <i>
          If you have any questions about your subscription, please contact
          support.
        </i>
      </Typography>
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
          align="center"
        >
          {SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}
        </Typography>
      </Link>
    </Flex>
  );
};
