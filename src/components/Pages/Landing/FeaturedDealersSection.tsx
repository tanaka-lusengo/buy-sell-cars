"use client";

import Link from "next/link";
import { Typography } from "../../ui";
import { Box, Flex } from "@/styled-system/jsx";
import { Profile } from "@/src/types";
import { StatusCode } from "@/src/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { CorouselViewport } from "./common.styled";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { FeaturedDealersCard } from "./components";

type FeaturedDealersSectionProps = {
  featuredDealers: {
    data: Profile[] | null;
    status: StatusCode;
    error: string | PostgrestError | null;
  };
};

export const FeaturedDealersSection = ({
  featuredDealers,
}: FeaturedDealersSectionProps) => {
  const [emblaRef] = useEmblaCarousel(
    { align: "start", loop: true, dragFree: true },
    [AutoScroll({ speed: 0.7, stopOnInteraction: false })]
  );

  const { data: dealers } = featuredDealers;

  return (
    <Box
      marginX="auto"
      paddingX="md"
      pt="md"
      pb="lg"
      width="100%"
      height="100%"
      maxWidth={{ sm: "pageSm", md: "pageMd", lg: "pageLg", xl: "pageXl" }}
    >
      <Box paddingY="md">
        <Typography as="h4" variant="h2">
          Browse by dealers
        </Typography>
      </Box>

      <Flex
        direction={{ base: "column", lg: "row" }}
        justifyContent="space-between"
        align="center"
        paddingY="lg"
        gap={{ base: "xs", md: "xl" }}
      >
        <Box width="100%" overflow="hidden">
          <CorouselViewport ref={emblaRef}>
            <Flex paddingY="lg">
              {dealers?.map((dealer, index) => (
                <FeaturedDealersCard key={index} dealer={dealer} />
              ))}
            </Flex>
          </CorouselViewport>
        </Box>
      </Flex>

      <Typography variant="h3" weight="bold" hoverEffect="color" align="center">
        <Link href="/dealers/">See all listed dealers</Link>
      </Typography>
    </Box>
  );
};
