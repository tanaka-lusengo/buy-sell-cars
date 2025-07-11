"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import refuelVictoriaFalls from "@/public/images/sponsors/refuel/refuel-victoria-falls.jpg";
import roadBoysLogistics from "@/public/images/sponsors/road-boys-logistics/road-boys-logistics.jpg";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { Box, Flex } from "@/styled-system/jsx";
import { REFUEL_WHATSAPP_URL } from "../constants";
import { BannerSlide } from "./components/BannerSlide";

export const FeatureBannerTwo = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false }), Fade()]
  );

  const sponsors = [
    {
      href: REFUEL_WHATSAPP_URL,
      src: refuelVictoriaFalls,
      alt: "Refuel now open in Victoria Falls",
      name: SPONSOR_NAMES.REFUEL,
    },
    {
      href: EXTERNAL_URLS.ROAD_BOYS_LOGISTICS_URL,
      src: roadBoysLogistics,
      alt: "Road boys logistics Zimbabwe",
      name: SPONSOR_NAMES.ROAD_BOYS_LOGISTICS,
    },
  ];

  return (
    <Box
      bg="greyLight"
      paddingX="md"
      paddingY="lg"
      width="100%"
      overflow="hidden"
    >
      <Box ref={emblaRef} width="100%">
        <Flex width="100%">
          {sponsors.map((sponsor, index) => (
            <Box
              key={index}
              flex="0 0 100%"
              opacity={0}
              width="100%"
              transition="opacity 0.6s ease-in-out"
            >
              <BannerSlide
                href={sponsor.href}
                src={sponsor.src}
                alt={sponsor.alt}
                name={sponsor.name}
              />
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
