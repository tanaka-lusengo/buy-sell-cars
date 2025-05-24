"use client";

import { Box, Flex } from "@/styled-system/jsx";
import Image from "next/image";

export const FeatureBannerTwo = () => {
  return (
    <Box bg="greyLight" paddingY="lg">
      <Flex
        marginX="auto"
        height="100%"
        justifyItems="center"
        width={{ base: "100%", md: "110rem" }}
        borderRadius="1.2rem"
        _hover={{
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        }}
        transition="all 0.3s ease-in-out"
      >
        <Image
          src="/images/sponsors/road-boys-logistics.jpg"
          alt="Road boys logistics Zimbabwe"
          objectFit="cover"
          loading="lazy"
          height={1100}
          width={1000}
          style={{
            width: "100%",
            borderRadius: "1.2rem",
          }}
        />
      </Flex>
    </Box>
  );
};
{
  /* <Image
  src="/images/sponsors/road-boys-logistics.jpg"
  alt="Rossi Tyres Harrare Drive Zimbabwe"
  objectFit="cover"
  loading="lazy"
  height={1000}
  width={1000}
  style={{
    width: '100%',
  }}
/> */
}
