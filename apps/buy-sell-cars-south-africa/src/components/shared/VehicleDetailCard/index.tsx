"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Typography } from "~bsc-shared/ui";
import { useFileUploadHelpers } from "@/src/hooks";
import { Profile, VehicleCategoryType, VehicleWithImage } from "@/src/types";
import { Box, Divider, Flex } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { FeaturePreviewCard } from "../FeaturePreviewCard";
import { FinanceCalculator } from "../FinanceCalculator";
import {
  CarouselThumbnails,
  CarouselMainImage,
  OverviewContent,
  VehicleDetails,
  VehicleTitle,
  SellerImage,
  SellerContent,
} from "./components";

type VehicleDetailCardProps = {
  vehicleCategory: VehicleCategoryType[number];
  vehicle: VehicleWithImage;
  allVehiclesByOwner?: VehicleWithImage[] | null;
  owner: Profile | null;
};

export const VehicleDetailCard = ({
  vehicleCategory,
  vehicle,
  allVehiclesByOwner,
  owner,
}: VehicleDetailCardProps) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const filterVehiclesByOwner = allVehiclesByOwner
    ? allVehiclesByOwner.filter(
        (v) => v.owner_id === vehicle.owner_id && v.id !== vehicle.id
      )
    : [];

  return (
    <Box backgroundColor="greyLight">
      <Box
        marginX="auto"
        width="100%"
        height="100%"
        paddingX="md"
        maxWidth={{ sm: "pageSm", md: "pageMd", lg: "pageLg", xl: "pageXl" }}
      >
        <Flex
          direction={{ base: "column", xl: "row" }}
          justifyContent="center"
          alignItems={{ base: "center", xl: "flex-start" }}
          gap={{ base: "xs", xl: "lg" }}
        >
          {/* LHS Images & Overview */}
          <Box paddingX={{ base: "none", sm: "md" }} paddingY="lg">
            <Box justifyItems={{ base: "center", md: "flex-start" }}>
              {/* Main Image */}
              <CarouselMainImage
                emblaMainRef={emblaMainRef}
                vehicle={vehicle}
                getPublicUrl={getPublicUrl}
                setSelectedIndex={setSelectedIndex}
              />

              {/* Thumbnails */}
              <CarouselThumbnails
                emblaThumbsRef={emblaThumbsRef}
                vehicle={vehicle}
                getPublicUrl={getPublicUrl}
                selectedIndex={selectedIndex}
                onThumbClick={onThumbClick}
              />
            </Box>

            {/* Overview */}
            <Box display={{ base: "block", xl: "none" }}>
              <VehicleTitle vehicle={vehicle} flexDirection="row" />
            </Box>

            <OverviewContent vehicle={vehicle} />

            <Divider color="grey" marginY="lg" />

            <Box display={{ base: "none", xl: "block" }}>
              <FinanceCalculator vehiclePrice={vehicle.price} />
            </Box>
          </Box>

          {/* RHS Details */}
          <Box
            position={{ base: "static", xl: "sticky" }}
            top={{ base: "none", xl: "130px" }}
            paddingTop={{ base: "none", xl: "lg" }}
          >
            <Flex direction="column" gap="lg">
              <Box display={{ base: "none", xl: "block" }}>
                <VehicleTitle vehicle={vehicle} />
              </Box>

              <Flex
                gap="lg"
                alignItems="flex-start"
                direction={{ base: "column", sm: "row" }}
              >
                <SellerImage owner={owner} getPublicUrl={getPublicUrl} />

                <SellerContent owner={owner} vehicle={vehicle} />
              </Flex>

              <Divider color="grey" />

              <Box display={{ base: "block", xl: "none" }}>
                <FinanceCalculator vehiclePrice={vehicle.price} />
              </Box>

              <VehicleDetails vehicle={vehicle} />
            </Flex>
          </Box>
        </Flex>

        <Divider color="grey" marginY="lg" />

        {/* Other Vehicles by Owner */}
        <Box marginTop="md" marginBottom="xl">
          <Typography variant="h3" align="center">
            Explore more vehicles from: {owner?.dealership_name || "this owner"}
          </Typography>
        </Box>

        <Flex flexWrap="wrap" justifyContent="center" gap="md" paddingX="md">
          {filterVehiclesByOwner.map((vehicle) => (
            <FeaturePreviewCard
              key={vehicle.id}
              vehicleCategory={vehicleCategory}
              width="26rem"
              height="25rem"
              vehicle={vehicle}
              owner={owner}
              isRental={vehicle.listing_category === "rental"}
            />
          ))}
        </Flex>

        <Divider color="grey" paddingY="lg" />
      </Box>
    </Box>
  );
};
