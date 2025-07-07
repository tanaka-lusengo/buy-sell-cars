"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Box, Container, Flex } from "@/styled-system/jsx";
import { Filter } from "../../Filter";
import { BannerContainer, fadeSlide } from "../common.styled";
import { BannerSlideOne, BannerSlideTwo } from "./components/BannerSlides";

export const HeroBanner = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false }), Fade()]
  );

  return (
    <Container
      px="0"
      minHeight={{ base: "48rem", md: "54rem" }}
      position="relative"
    >
      {/* Background Image */}
      <Image
        src="/images/hero.jpg"
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

      {/* Gradient Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        backgroundGradient="linear-gradient(rgba(30, 39, 55, 0.65), rgba(30, 39, 55, 0.65))"
        zIndex="5"
      />

      <Container
        px="0"
        width="100%"
        height="100%"
        zIndex="10"
        position="absolute"
      >
        <BannerContainer>
          <Flex
            height="100%"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            px={{ base: "sm", lg: "lg" }}
          >
            {/* Carousel */}
            <Box
              ref={emblaRef}
              position="relative"
              overflow="hidden"
              width="100%"
              height="100%"
              maxWidth={{ base: "100%", lg: 750 }}
            >
              <Box position="relative" width="100%" height="100%">
                <Box
                  className={fadeSlide}
                  position="absolute"
                  inset={0}
                  height="100%"
                >
                  <BannerSlideOne />
                </Box>
                <Box
                  className={fadeSlide}
                  position="absolute"
                  inset={0}
                  height="100%"
                >
                  <BannerSlideTwo />
                </Box>
              </Box>
            </Box>

            {/* Filter */}
            <Box display={{ base: "none" }}>
              <Filter />
            </Box>
          </Flex>
        </BannerContainer>
      </Container>
    </Container>
  );
};
