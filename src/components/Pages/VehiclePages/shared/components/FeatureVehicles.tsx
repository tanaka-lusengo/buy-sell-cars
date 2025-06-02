"use client";

import { Typography } from "@/src/components/ui";
import { FeaturePreviewCard } from "@/src/components/shared";
import { usePrevNextCarouselFunctions } from "@/src/hooks";
import { Box, Flex } from "@/styled-system/jsx";
import useEmblaCarousel from "embla-carousel-react";
import { formatToReadableString } from "@/src/utils";
import { CorouselViewport } from "../../../Landing/common.styled";
import { VehicleCategoryType, VehicleWithImageAndDealer } from "@/src/types";

type FeatureVehiclesProps = {
  vehicleCategory: VehicleCategoryType[number];
  isRental: boolean;
  featuredCarsWithDealerDetails: VehicleWithImageAndDealer[] | undefined;
  isFeature?: boolean;
};

export const FeatureVehicles = ({
  vehicleCategory,
  isRental,
  featuredCarsWithDealerDetails,
  isFeature = false,
}: FeatureVehiclesProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    watchDrag: true,
    dragFree: true,
  });

  const { PrevButton, NextButton } = usePrevNextCarouselFunctions(emblaApi);

  const vehicleDisplayName =
    vehicleCategory === "earth_moving"
      ? "Earth Moving Equipment"
      : vehicleCategory === "agriculture"
        ? "Agricultural Equipment"
        : `${formatToReadableString(vehicleCategory)}s`;

  return (
    <>
      <Box paddingY="xs">
        <Typography variant="h3" align="center">
          Featured {vehicleDisplayName} {isRental ? "to rent" : "for sale"}
        </Typography>
      </Box>

      {featuredCarsWithDealerDetails?.length === 0 ? (
        <Flex direction="column" gap="sm" paddingX="sm" paddingY="lg">
          <Typography variant="h4" align="center">
            Contact us now to become a featured dealer and showcase your
            vehicles here!
          </Typography>
        </Flex>
      ) : (
        <Box paddingTop="sm" paddingX="sm" overflow="hidden">
          <CorouselViewport ref={emblaRef}>
            <Flex gap="lg">
              {featuredCarsWithDealerDetails?.map((car, index) => (
                <FeaturePreviewCard
                  isFeature={isFeature}
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
    </>
  );
};
