"use client";

import Link from "next/link";
import Image from "next/image";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { Box, Flex } from "@/styled-system/jsx";

export const FeatureBannerTwo = () => {
  return (
    <Link
      href={EXTERNAL_URLS.ROAD_BOYS_LOGISTICS_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box bg="greyLight" paddingY="lg" paddingX="md" width="100%">
        <Flex
          marginX="auto"
          height="100%"
          justifyItems="center"
          width={{ base: "100%", xl: "90rem" }}
          borderRadius="1.2rem"
          _hover={{
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
          }}
          transition="all 0.3s ease-in-out"
        >
          <Image
            src="/images/sponsors/road-boys-logistics.jpg"
            alt="Road boys logistics Zimbabwe"
            loading="lazy"
            height={1100}
            width={1000}
            style={{
              objectFit: "cover",
              width: "100%",
              borderRadius: "1.2rem",
            }}
          />
        </Flex>
      </Box>
    </Link>
  );
};
