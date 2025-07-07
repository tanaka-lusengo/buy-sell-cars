"use client";

import { PostgrestError } from "@supabase/supabase-js";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Typography } from "~bsc-shared/ui";
import { StatusCode } from "~bsc-shared/utils";
import { Profile } from "@/src/types";
import { Box, Flex } from "@/styled-system/jsx";
import { FeaturedDealersCard } from "./FeaturedDealersCard";
import { CorouselViewport } from "./common.styled";

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
        <Typography variant="h2">Browse by dealers</Typography>
      </Box>

      <Box paddingY="lg" width="100%" overflow="hidden">
        <CorouselViewport ref={emblaRef}>
          <Flex paddingY="lg">
            {dealers
              ?.filter((detail) => detail.profile_logo_path)
              .map((dealer, index) => (
                <FeaturedDealersCard key={index} dealer={dealer} />
              ))}
          </Flex>
        </CorouselViewport>
      </Box>

      <Typography variant="h3" weight="bold" hoverEffect="color" align="center">
        <Link href="/dealers/">See all listed dealers</Link>
      </Typography>
    </Box>
  );
};
