import { ResponsiveContainer, Typography } from "~bsc-shared/ui";
import { SocialMediaLink } from "@/src/components/shared";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { VStack, HStack } from "@/styled-system/jsx";

export const SocialMediaSection = () => {
  return (
    <ResponsiveContainer>
      <VStack
        marginY="lg"
        marginX="auto"
        gap="lg"
        paddingY="lg"
        border="1px solid"
        borderColor="grey"
        borderRadius={8}
        maxWidth={500}
      >
        <Typography variant="h3" color="primary" align="center">
          Follow us on social media
        </Typography>
        <Typography variant="h4" align="center">
          Stay updated with the latest news and offers
        </Typography>

        <HStack gap="lg">
          <SocialMediaLink
            type="instagram"
            label="Instagram"
            href={SOCIAL_MEDIA_URLS.instagram}
          />

          <SocialMediaLink
            type="square-facebook"
            label="Facebook"
            href={SOCIAL_MEDIA_URLS.facebook}
          />
        </HStack>
      </VStack>
    </ResponsiveContainer>
  );
};
