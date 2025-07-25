"use client";

import Image from "next/image";
import Link from "next/link";
import { useWindowSize } from "~bsc-shared/hooks";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { breakpointsNumber } from "@/src/styles";
import { Box, Flex } from "@/styled-system/jsx";

export const FeatureBannerOne = () => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  const mobileImage = "/images/sponsors/rossi-tyres-sm.jpg";
  const desktopImage = "/images/sponsors/rossi-tyres-lg.jpg";

  return (
    <Link
      href={EXTERNAL_URLS.ROSSI_TYRES_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box bg="greyLight" padding="md" width="100%">
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
            src={isMobile ? mobileImage : desktopImage}
            alt="Rossi Tyres Harrare Drive Zimbabwe"
            loading="lazy"
            height={1100}
            width={1000}
            style={{
              objectFit: "cover",
              width: "100%",
              borderRadius: "1.2rem",
            }}
            quality={70}
          />
        </Flex>
      </Box>
    </Link>
  );
};
