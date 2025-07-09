import Image from "next/image";
import Link from "next/link";
import { Typography } from "~bsc-shared/ui";
import defaultUserIcon from "@/public/images/default-user-icon.png";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import { Profile, StorageBucket } from "@/src/types";
import { Box, VStack } from "@/styled-system/jsx";

type SellerImageProps = {
  owner: Profile | null;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const SellerImage = ({ owner, getPublicUrl }: SellerImageProps) => {
  const hasDealershipName =
    typeof owner?.dealership_name === "string" &&
    owner.dealership_name.trim().length > 0;

  const sellerName = hasDealershipName
    ? owner.dealership_name
    : `${owner?.first_name ?? ""} ${owner?.last_name ?? ""}`.trim();

  return (
    <Link href={`/dealers/${owner?.id}`}>
      <VStack
        _hover={{ opacity: "0.9" }}
        transition="0.2s ease-in-out"
        alignItems="center"
      >
        <Box
          position="relative"
          width={{ base: "25rem", md: "30rem" }}
          height={{ base: "25rem", md: "30rem" }}
          overflow="hidden"
          border="1px solid"
          borderColor="grey"
          borderRadius="8px"
        >
          <Image
            src={
              owner?.profile_logo_path
                ? getPublicUrl("profile-logos", owner.profile_logo_path)
                : defaultUserIcon
            }
            alt={`${owner?.dealership_name} logo`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectPosition: "center",
              objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                String(owner?.dealership_name)
              )
                ? "contain"
                : "cover",
            }}
            quality={70}
          />
        </Box>
        <Typography variant="h4">{sellerName}</Typography>
      </VStack>
    </Link>
  );
};
