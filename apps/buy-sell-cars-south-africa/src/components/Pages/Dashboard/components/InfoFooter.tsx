import Link from "next/link";
import { P } from "~bsc-shared/ui";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { Flex } from "@/styled-system/jsx";

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
      <P align="center" color={color}>
        <i>
          If you have any questions about your subscription, please contact
          support.
        </i>
      </P>
      <Link
        href={`${SOCIAL_MEDIA_URLS.email}?subject=${encodeURIComponent("Account Inquiry")}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Email us for support"
      >
        <P color="primaryDark" weight="bold" hoverEffect="color" align="center">
          {SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}
        </P>
      </Link>
    </Flex>
  );
};
