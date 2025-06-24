"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { usePrevNextCarouselFunctions } from "~bsc-shared/hooks";
import { Typography } from "~bsc-shared/ui";
import { formatToReadableString } from "~bsc-shared/utils";
import { FeaturePreviewCard } from "@/src/components/shared";
import { useAuth } from "@/src/context/auth-context";
import { VehicleCategoryType, VehicleWithImageAndDealer } from "@/src/types";
import { Box, Flex } from "@/styled-system/jsx";
import { CorouselViewport } from "../../../Landing/common.styled";

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

  const { profile } = useAuth();

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
            <Typography
              as="span"
              weight="bold"
              color="primary"
              hoverEffect="color"
              style={{ fontSize: "inherit" }}
            >
              <Link href={profile ? "/dashboard/subscriptions" : "/sign-up"}>
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
