import Image from "next/image";
import { H1, H2, P } from "~bsc-shared/ui";
import { Flex, Box, HStack } from "@/styled-system/jsx";

export const HomeBannerSlide = () => {
  const factList = [
    "Launching a new era of digital automotive trading",
    "Secure, transparent, and professional platform",
    "Simple 24/7 Digital Showcase",
  ];

  return (
    <Flex
      height="100%"
      width="100%"
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      gap="md"
    >
      <H1 font="heading" weight="bold" color="primary">
        Zimbabwe&#39;s Premier Vehicle Marketplace
      </H1>
      <H2 font="heading" weight="bold" color="white">
        Revolutionising the way you buy and sell cars
      </H2>

      <Box display={{ base: "none", md: "block" }}>
        {factList.map((fact, index) => (
          <HStack key={index} alignItems="flex-start">
            <Image
              src="/green-check-icon.svg"
              alt="Green Check Icon"
              width={24}
              height={24}
              style={{ height: "auto" }}
              unoptimized
            />
            <P color="white">{fact}</P>
          </HStack>
        ))}
      </Box>
    </Flex>
  );
};
