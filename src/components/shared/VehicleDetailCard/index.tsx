"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Flex } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { useFileUploadHelpers } from "@/src/hooks";
import { Profile, VehicleWithImage } from "@/src/types";
import useEmblaCarousel from "embla-carousel-react";
import {
  CarouselThumbnails,
  CarouselMainImage,
  OverviewContent,
  VehicleDetails,
  VehicleTitle,
  SellerImage,
  SellerContent,
} from "./components";
import { FeaturePreviewCard } from "../FeaturePreviewCard";
import { Typography } from "../../ui";

type VehicleDetailCardProps = {
  vehicle: VehicleWithImage;
  allVehiclesByOwner?: VehicleWithImage[] | null;
  owner: Profile | null;
};

export const VehicleDetailCard = ({
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
          </Box>

          {/* RHS Details */}
          <Box paddingTop={{ base: "none", xl: "lg" }} paddingBottom="lg">
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

              <VehicleDetails vehicle={vehicle} />
            </Flex>
          </Box>
        </Flex>

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
              width="26rem"
              height="25rem"
              car={vehicle}
              owner={owner}
              isRental={vehicle.listing_category === "rental"}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
