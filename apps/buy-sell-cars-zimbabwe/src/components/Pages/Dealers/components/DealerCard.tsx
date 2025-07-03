import Image from "next/image";
import Link from "next/link";
import { Typography } from "~bsc-shared/ui";
import defaultUserIcon from "@/public/images/default-user-icon.png";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import { useFileUploadHelpers } from "@/src/hooks";
import { ProfileWithSubscription } from "@/src/types";
import { Box, HStack } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";

type DealerCardProps = {
  dealer: ProfileWithSubscription;
  isFeature?: boolean;
};

export const DealerCard = ({ dealer, isFeature }: DealerCardProps) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  return (
    <Link href={`/dealers/${dealer.id}/`}>
      <Box
        border={isFeature ? "3.5px solid" : "2px solid"}
        borderColor={isFeature ? "primary" : "grey"}
        borderRadius="1.5rem"
        bg="white"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        _hover={{
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.01)",
        }}
        transition="all 0.3s ease-in-out"
      >
        <Box
          position="relative"
          width={{ base: "25rem", xl: "30rem" }}
          height={{ base: "25rem", xl: "30rem" }}
          overflow="hidden"
          p="sm"
        >
          <Image
            src={
              dealer.profile_logo_path
                ? getPublicUrl("profile-logos", dealer.profile_logo_path)
                : defaultUserIcon
            }
            alt={`${dealer.dealership_name} logo`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectPosition: "center",
              objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                String(dealer.dealership_name)
              )
                ? "contain"
                : "cover",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
            quality={70}
          />
        </Box>

        <Box
          borderBottomRadius="1rem"
          paddingY="md"
          paddingLeft="sm"
          width={{ base: "25rem", xl: "30rem" }}
        >
          <Box marginBottom="sm">
            <Typography variant="h4" weight="bold">
              {dealer.dealership_name}
            </Typography>
          </Box>

          <HStack>
            <i
              className="fa-solid fa-envelope"
              aria-hidden="true"
              title="email envelope"
              style={{ width: "2rem" }}
            ></i>
            <Typography
              title={dealer.email}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                maxWidth: "100%",
              }}
            >
              {dealer.email}
            </Typography>
          </HStack>
          <HStack>
            <i
              className="fa-solid fa-phone"
              aria-hidden="true"
              title="phone"
              style={{ width: "2rem" }}
            ></i>
            <Typography>{dealer.phone}</Typography>
          </HStack>
          <HStack>
            <i
              className="fa-solid fa-location-dot"
              aria-hidden="true"
              title="location"
              style={{ width: "2rem" }}
            ></i>
            <Typography>{dealer.location}</Typography>
          </HStack>
        </Box>
      </Box>
    </Link>
  );
};
