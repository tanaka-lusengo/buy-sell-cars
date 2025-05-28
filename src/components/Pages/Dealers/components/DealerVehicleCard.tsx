"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Box, Divider, Flex, HStack, VStack } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { Profile, VehicleWithImage } from "@/src/types";
import { createClient } from "@/supabase/client";
import { useFileUploadHelpers } from "@/src/hooks";
import { formatPriceToDollars, formatMileage } from "@/src/utils";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import Link from "next/link";

type DealerVehicleCardProps = {
  owner: Profile | null;
  vehicle: VehicleWithImage;
  isRental: boolean;
};

export const DealerVehicleCard = ({
  owner,
  vehicle,
  isRental,
}: DealerVehicleCardProps) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const vehiclePrice = useMemo(
    () => formatPriceToDollars(vehicle.price),
    [vehicle.price]
  );
  const vehicleMileage = useMemo(
    () => formatMileage(vehicle.mileage || 0),
    [vehicle.mileage]
  );

  const isUsedVehicle = vehicle.condition === "used";

  const slug =
    vehicle.vehicle_category === "earth_moving"
      ? "earth-moving"
      : vehicle.vehicle_category;

  const categoryPath = isRental ? "rentals" : "sales";

  return (
    <Link href={`/${slug}/${categoryPath}/${vehicle.id}/`}>
      <Box
        bg="white"
        borderRadius="1.2rem"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        _hover={{
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.01)",
        }}
        transition="all 0.3s ease-in-out"
      >
        <VStack alignItems="center" padding="sm">
          <Box
            display="flex"
            justifyItems="center"
            position="relative"
            width={{ base: "26rem", md: "28rem" }}
            height={{ base: "18rem", md: "28rem" }}
            borderRadius="8px"
            overflow="hidden"
          >
            <Image
              src={getPublicUrl(
                "vehicle-images",
                vehicle.images[0]?.image_path ?? ""
              )}
              alt={`${vehicle.id}: Vehicle: ${vehicle.make}`}
              fill
              loading="lazy"
              objectFit="cover"
              style={{
                borderRadius: "8px",
              }}
            />
          </Box>

          <Flex
            padding="sm"
            direction="column"
            justifyContent="space-between"
            gap="sm"
            width="100%"
          >
            <Box>
              <Typography>{vehicle.year}</Typography>
              <Typography weight="bold" variant="h3">
                {vehicle.make}, {vehicle.model}
              </Typography>
              <Typography color="grey" weight="bold">
                Mileage: {vehicleMileage} km
              </Typography>
            </Box>

            <Divider color="grey" />

            <Box>
              <Typography variant="h3" weight="bold" color="primaryDark">
                {vehiclePrice}{" "}
                {isRental ? (
                  <Typography as="span" variant="h4">
                    / per day
                  </Typography>
                ) : (
                  ""
                )}
              </Typography>
              <Typography>
                {isUsedVehicle ? "Pre-owned" : "Brand new"}
              </Typography>

              <HStack alignItems="end" justifyContent="space-between">
                <HStack>
                  <i
                    className="fa-solid fa-location-dot"
                    aria-hidden="true"
                    title="location"
                  ></i>
                  <Typography>{owner?.location}</Typography>
                </HStack>
                <Box
                  position="relative"
                  width="60px"
                  height="60px"
                  borderRadius="1rem"
                  overflow="hidden"
                >
                  <Image
                    src={getPublicUrl(
                      "profile-logos",
                      owner?.profile_logo_path ?? ""
                    )}
                    alt={owner?.dealership_name ?? ""}
                    fill
                    loading="lazy"
                    style={{
                      objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                        String(owner?.dealership_name)
                      )
                        ? "contain"
                        : "cover",
                      borderRadius: "1rem",
                    }}
                  />
                </Box>
              </HStack>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Link>
  );
};
