import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/src/types";
import { useFileUploadHelpers } from "@/src/hooks";
import { createClient } from "@/supabase/client";
import { Box, HStack } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";

export const DealerCard = ({ dealer }: { dealer: Profile }) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  return (
    <Link href={`/dealers/${dealer.id}`}>
      <Box
        border="1.5px solid"
        borderColor="grey"
        borderRadius="1rem"
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
            src={getPublicUrl("profile-logos", dealer.profile_logo_path ?? "")}
            alt={`${dealer.dealership_name} logo`}
            fill
            objectFit="cover"
            objectPosition="center"
            style={{
              objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                String(dealer.dealership_name)
              )
                ? "contain"
                : "cover",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          />
        </Box>

        <Box borderBottomRadius="1rem" paddingY="md" paddingLeft="sm">
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
            <Typography>{dealer.email}</Typography>
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
