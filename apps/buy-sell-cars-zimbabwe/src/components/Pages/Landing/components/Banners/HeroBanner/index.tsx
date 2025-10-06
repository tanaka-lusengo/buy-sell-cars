"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { breakpointsNumber, useWindowSize } from "~bsc-shared";
import { ResponsiveContainer } from "~bsc-shared/ui";
import heroBackgroundImg from "@/public/images/hero.jpg";
import refuelBannerSmallImg from "@/public/images/sponsors/refuel/refuel-all-towns.jpg";
import refuelBannerLargeImg from "@/public/images/sponsors/refuel/refuel-hero-banner.jpg";
import { trackPostHogEvent, useTrackOnView } from "@/src/components/Analytics";
import { SPONSOR_NAMES } from "@/src/constants/sponsors";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { Box, Container, Flex } from "@/styled-system/jsx";
import { REFUEL_WHATSAPP_URL } from "../constants";
import { HomeBannerSlide } from "./components/HomeBannerSlide";

export const HeroBanner = () => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.lg;

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false }), Fade()]
  );

  type BannerSlide = {
    backgroundImage: StaticImageData | string;
    sponsorName: string;
    href: string;
    alt: string;
    objectFit: "cover" | "contain" | "scale-down";
    content?: React.ReactNode;
    isHomeBanner?: boolean;
  };

  const bannerSlides: BannerSlide[] = [
    {
      backgroundImage: heroBackgroundImg,
      sponsorName: "",
      href: "/",
      alt: "Hero Image",
      objectFit: "cover",
      content: <HomeBannerSlide />,
      isHomeBanner: true,
    },
    {
      backgroundImage: isMobile ? refuelBannerSmallImg : refuelBannerLargeImg,
      sponsorName: SPONSOR_NAMES.REFUEL,
      href: REFUEL_WHATSAPP_URL,
      objectFit: "contain",
      alt: "Refuel, now open in Gweru, Bulawayo and Victoria Falls",
      content: null,
    },
  ];

  // Create refs for each sponsor banner
  const supaCarSoundsRef = useRef<HTMLImageElement>(null);
  const refuelRef = useRef<HTMLImageElement>(null);

  const sponsorBannerRefs = [null, supaCarSoundsRef, refuelRef];

  // Set up individual tracking for each sponsor banner
  useTrackOnView(supaCarSoundsRef, () =>
    trackPostHogEvent({
      event: "sponsor_ad_view",
      properties: {
        sponsor: SPONSOR_NAMES.SUPA_CAR_SOUNDS,
        action: "view",
        url: EXTERNAL_URLS.SUPA_CAR_SOUNDS_URL,
        placement: "landing_page_banner_top",
      },
    })
  );

  useTrackOnView(refuelRef, () =>
    trackPostHogEvent({
      event: "sponsor_ad_view",
      properties: {
        sponsor: SPONSOR_NAMES.REFUEL,
        action: "view",
        url: REFUEL_WHATSAPP_URL,
        placement: "landing_page_banner_top",
      },
    })
  );

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
                      objectFit: slide.objectFit,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <Link
                    href={slide.href}
                    onClick={() =>
                      trackPostHogEvent({
                        event: "sponsor_ad_click",
                        properties: {
                          sponsor: slide.sponsorName,
                          action: "click",
                          url: slide.href,
                          placement: "landing_page_banner_top",
                        },
                      })
                    }
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
                      ref={sponsorBannerRefs[index]}
                      src={slide.backgroundImage}
                      alt={slide.alt}
                      fill
                      loading="lazy"
                      sizes="100vw"
                      quality={70}
                      style={{
                        position: "absolute",
                        objectFit: slide.objectFit,
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
                        justifyContent="center"
                        px={{ base: "sm", lg: "lg" }}
                      >
                        <Box position="relative" width="100%" height="100%">
                          {slide.content}
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
