import Image from "next/image";
import Link from "next/link";
import { Profile, StorageBucket } from "@/src/types";
import { Box, VStack } from "@/styled-system/jsx";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import { Typography } from "@/src/components/ui";

type SellerImageProps = {
  owner: Profile | null;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const SellerImage = ({ owner, getPublicUrl }: SellerImageProps) => {
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
          borderRadius="8px"
        >
          <Image
            src={getPublicUrl("profile-logos", owner?.profile_logo_path ?? "")}
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
          />
        </Box>
        <Typography variant="h4">{owner?.dealership_name}</Typography>
      </VStack>
    </Link>
  );
};
