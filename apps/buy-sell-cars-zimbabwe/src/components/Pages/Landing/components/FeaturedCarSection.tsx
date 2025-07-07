"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { usePrevNextCarouselFunctions } from "~bsc-shared/hooks";
import { Typography } from "~bsc-shared/ui";
import { FeaturePreviewCard } from "@/src/components/shared";
import { useAuth } from "@/src/context/auth-context";
import { VehicleWithImageAndDealer } from "@/src/types";
import { Box, Container, Flex } from "@/styled-system/jsx";
import { Filter } from "./Filter";
import { CorouselViewport } from "./common.styled";

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

  const { profile } = useAuth();

  return (
    <>
      <Box paddingY="lg">
        <Typography variant="h2" align="center">
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

          {featuredCarsWithDealerDetails?.length === 0 ? (
            <Flex direction="column" gap="sm" paddingX="sm" paddingY="lg">
              <Typography variant="h4" align="center">
                <Typography
                  as="span"
                  weight="bold"
                  color="primary"
                  hoverEffect="color"
                  style={{ fontSize: "inherit" }}
                >
                  <Link
                    href={profile ? "/dashboard/subscriptions" : "/sign-up"}
                  >
                    Subscribe now
                  </Link>
                </Typography>{" "}
                to become a featured dealer and showcase your vehicles here!
              </Typography>
            </Flex>
          ) : (
            <Box paddingTop="sm" paddingX="sm" overflow="hidden">
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
          )}
        </Box>
      </Container>
    </>
  );
};
