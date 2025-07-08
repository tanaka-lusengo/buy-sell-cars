import Image from "next/image";
import { Typography } from "~bsc-shared/ui";
import { Flex, Box, HStack } from "@/styled-system/jsx";

export const BannerSlideContentOne = () => {
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
      <Typography variant="h1" font="heading" weight="bold" color="primary">
        Zimbabwe&#39;s Premier Vehicle Marketplace
      </Typography>
      <Typography variant="h2" font="heading" weight="bold" color="white">
        Revolutionising the way you buy and sell cars
      </Typography>

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
            <Typography color="white">{fact}</Typography>
          </HStack>
        ))}
      </Box>
    </Flex>
  );
};
