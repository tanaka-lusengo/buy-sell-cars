import Image from "next/image";
import Link from "next/link";
import { Typography } from "~bsc-shared/ui";
import refuelAllTowns from "@/public/images/sponsors/refuel/refuel-all-towns.jpg";
import { Flex, Box, HStack } from "@/styled-system/jsx";
import { REFUEL_WHATSAPP_URL } from "../../constants";

export const BannerSlideOne = () => {
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

export const BannerSlideTwo = () => {
  return (
    <Link href={REFUEL_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        borderRadius="1.2rem"
        transition="all 0.3s ease-in-out"
        _hover={{
          opacity: 0.9,
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Image
          src={refuelAllTowns}
          alt="Refuel now open in Gweru, Bulawayo and Victoria Falls"
          loading="lazy"
          height={700}
          width={400}
          style={{
            objectFit: "cover",
            width: "100%",
            borderRadius: "1.2rem",
          }}
        />
      </Flex>
    </Link>
  );
};
