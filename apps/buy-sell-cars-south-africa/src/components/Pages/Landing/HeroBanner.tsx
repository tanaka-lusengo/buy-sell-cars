import Image from "next/image";
import { Typography, ResponsiveContainer } from "~bsc-shared/ui";
import heroImageBanner from "@/public/images/hero-banner.jpg";
import { Box, Container, Flex, HStack } from "@/styled-system/jsx";

const factList = [
  "Launching a new era of digital automotive trading",
  "Secure, transparent, and professional platform",
  "Simple 24/7 Digital Showcase",
];

export const HeroBanner = () => {
  return (
    <Container
      px="0"
      minHeight={{ base: "48rem", md: "54rem" }}
      position="relative"
    >
      <Image
        src={heroImageBanner}
        alt="Hero Image"
        fill
        priority
        sizes="100vw"
        style={{
          position: "absolute",
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        quality={70}
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        backgroundGradient="linear-gradient(rgba(30, 39, 55, 0.35), rgba(30, 39, 55, 0.35))"
        zIndex={5}
      />
      <Container
        px="0"
        width="100%"
        height="100%"
        zIndex={10}
        position="absolute"
      >
        <ResponsiveContainer>
          <Flex
            height="100%"
            width="100%"
            marginX="auto"
            justifyContent="flex-start"
            // maxWidth={{ base: '100%', xl: '75%' }}
            // alignItems="center"
            // justifyContent="center"
          >
            <Flex
              height="100%"
              width="100%"
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              gap="md"
            >
              <Typography
                variant="h1"
                font="heading"
                weight="bold"
                color="primary"
              >
                South Africa&#39;s Premier Vehicle Marketplace
              </Typography>
              <Typography
                variant="h2"
                font="heading"
                weight="bold"
                color="white"
              >
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

            {/* <Box display={{ base: 'none', lg: 'block' }}>
              <Filter />
            </Box> */}
          </Flex>
        </ResponsiveContainer>
      </Container>
    </Container>
  );
};
