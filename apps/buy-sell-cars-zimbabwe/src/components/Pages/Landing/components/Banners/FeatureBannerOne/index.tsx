"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import ceramicPro from "@/public/images/sponsors/ceramic-pro/ceramic-pro.jpg";
import rossiTyresImg from "@/public/images/sponsors/rossi/rossi-tyres.jpg";
import { SPONSOR_NAMES, SPONSOR_URL } from "@/src/constants/sponsors";
import { Box, Flex } from "@/styled-system/jsx";
import { BannerSlide } from "./components/BannerSlide";

export const FeatureBannerOne = () => {
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
      href: SPONSOR_URL.ROSSI_TYRES_URL,
      src: rossiTyresImg,
      alt: "Rossi Tyres Zimbabwe",
      name: SPONSOR_NAMES.ROSSI_TYRES,
    },
    {
      href: SPONSOR_URL.CERAMIC_PRO_URL,
      src: ceramicPro,
      alt: "Ceramic Pro Zimbabwe",
      name: SPONSOR_NAMES.CERAMIC_PRO,
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
