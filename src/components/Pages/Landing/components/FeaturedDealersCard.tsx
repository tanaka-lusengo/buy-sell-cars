import Link from "next/link";
import Image from "next/image";
import defaultUserIcon from "@/public/images/default-user-icon.png";
import { useFileUploadHelpers } from "@/src/hooks";
import { Profile } from "@/src/types";
import { createClient } from "@/supabase/client";
import { Typography } from "@/src/components/ui";
import { VStack, Box } from "@/styled-system/jsx";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";

export const FeaturedDealersCard = ({ dealer }: { dealer: Profile }) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  return (
    <Box
      bg="white"
      marginX="sm"
      borderRadius="1rem"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      _hover={{
        cursor: "pointer",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        transform: "scale(1.01)",
      }}
      transition="all 0.3s ease-in-out"
    >
      <Link href={`/dealers/${dealer.id}`} passHref>
        <VStack alignItems="center" padding="sm">
          <Box
            position="relative"
            width="200px"
            height="200px"
            borderRadius="1rem"
            overflow="hidden"
          >
            <Image
              src={
                dealer.profile_logo_path
                  ? getPublicUrl("profile-logos", dealer.profile_logo_path)
                  : defaultUserIcon
              }
              alt={dealer.dealership_name ?? "Dealer Logo"}
              title={dealer.dealership_name ?? "Dealer Logo"}
              fill
              loading="lazy"
              sizes="(max-width: 600px) 100vw, 200px"
              style={{
                objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                  String(dealer.dealership_name)
                )
                  ? "contain"
                  : "cover",
                borderRadius: "1rem",
              }}
              quality={70}
            />
          </Box>

          <Typography variant="h4" align="center">
            {dealer.dealership_name}
          </Typography>
        </VStack>
      </Link>
    </Box>
  );
};
