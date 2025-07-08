"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer } from "~bsc-shared/ui";
import heroBackgroundImg from "@/public/images/hero.jpg";
import refuelBannerImg from "@/public/images/sponsors/refuel/refuel-all-towns.jpg";
import { Box, Container, Flex } from "@/styled-system/jsx";
import { Filter } from "../../Filter";
import { REFUEL_WHATSAPP_URL } from "../constants";
import { BannerSlideContentOne } from "./components/BannerSlides";

export const HeroBanner = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false }), Fade()]
  );

  const bannerSlides = [
    {
      backgroundImage: heroBackgroundImg,
      alt: "Hero Image",
      content: <BannerSlideContentOne />,
      isHomeBanner: true,
    },
    {
      backgroundImage: refuelBannerImg,
      alt: "Refuel, now open in Gweru, Bulawayo and Victoria Falls",
      content: null,
    },
  ];

  return (
    <Container
      px="0"
      minHeight={{ base: "48rem", md: "54rem" }}
      position="relative"
    >
      <Box
        ref={emblaRef}
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="1"
      >
        <Flex>
          {bannerSlides.map((slide, index) => {
            const isHomeBanner = !!slide.isHomeBanner;

            return (
              <Box
                key={index}
                flex="0 0 100%"
                position="relative"
                width="100%"
                height="100%"
                minHeight={{ base: "48rem", md: "54rem" }}
              >
                {/* Background Image */}
                {isHomeBanner ? (
                  <Image
                    src={slide.backgroundImage}
                    alt={slide.alt}
                    fill
                    priority
                    sizes="100vw"
                    quality={70}
                    style={{
                      position: "absolute",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <Link
                    href={REFUEL_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 100,
                    }}
                  >
                    <Image
                      src={slide.backgroundImage}
                      alt={slide.alt}
                      fill
                      loading="lazy"
                      sizes="100vw"
                      quality={70}
                      style={{
                        position: "absolute",
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Link>
                )}

                {/* Gradient Overlay */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  backgroundGradient={
                    isHomeBanner
                      ? "linear-gradient(rgba(30, 39, 55, 0.65), rgba(30, 39, 55, 0.65))"
                      : undefined
                  }
                  zIndex="5"
                />

                {/* Content */}
                {slide.content && (
                  <Container
                    width="100%"
                    height="100%"
                    position="absolute"
                    zIndex="10"
                  >
                    <ResponsiveContainer>
                      <Flex
                        height="100%"
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                        px={{ base: "sm", lg: "lg" }}
                      >
                        <Box position="relative" width="100%" height="100%">
                          {slide.content}
                        </Box>

                        {/* Filter */}
                        <Box display={{ base: "none" }}>
                          <Filter />
                        </Box>
                      </Flex>
                    </ResponsiveContainer>
                  </Container>
                )}
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Container>
  );
};
