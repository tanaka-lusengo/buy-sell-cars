"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Typography } from "../../ui";
import { Box, Container, Flex } from "@/styled-system/jsx";
import { CorouselViewport } from "./common.styled";
import { usePrevNextCarouselFunctions } from "@/src/hooks/usePrevNextCarouselFunctions";
import { VehicleWithImageAndDealer } from "@/src/types";
import { FeaturePreviewCard } from "@/src/components/shared";
import { Filter } from "./components";

export const FeaturedCarSection = ({
  featuredCarsWithDealerDetails,
}: {
  featuredCarsWithDealerDetails: VehicleWithImageAndDealer[] | undefined;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    watchDrag: true,
    dragFree: true,
  });

  const { PrevButton, NextButton } = usePrevNextCarouselFunctions(emblaApi);

  return (
    <>
      <Box paddingY="lg">
        <Typography as="h3" variant="h2" align="center">
          Featured cars for sale
        </Typography>
      </Box>

      <Container bg="greyLight" paddingY="lg" paddingX="md">
        <Box
          maxWidth={{ sm: "pageSm", md: "pageMd", lg: "pageLg", xl: "pageXl" }}
          marginX="auto"
        >
          <Box display="none">
            <Filter />
          </Box>

          <Box paddingX="sm" overflow="hidden">
            <CorouselViewport ref={emblaRef}>
              <Flex gap="lg">
                {featuredCarsWithDealerDetails?.map((car, index) => (
                  <FeaturePreviewCard
                    vehicleCategory="car"
                    key={index}
                    vehicle={car}
                    isRental={false}
                  />
                ))}
              </Flex>
            </CorouselViewport>

            <Flex justifyContent="center" gap="lg" paddingY="lg">
              <PrevButton />
              <NextButton />
            </Flex>
          </Box>
        </Box>
      </Container>
    </>
  );
};
