"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import defaultUserIcon from "@/public/images/default-user-icon.png";
import { Box, Divider, Flex, HStack, VStack } from "@/styled-system/jsx";
import { Typography } from "../../ui";
import { VehicleWithImageAndDealer } from "@/src/types";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/src/context/auth-context";
import { logAdClick } from "@/src/server/actions/analytics";
import { useFileUploadHelpers } from "@/src/hooks";
import { formatPriceToRands, formatMileage, getPageName } from "@/src/utils";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";

type CarPreviewCardProps = {
  car: VehicleWithImageAndDealer;
  isRental: boolean;
};

export const CarPreviewCard = ({ car, isRental }: CarPreviewCardProps) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const carPrice = useMemo(() => formatPriceToRands(car.price), [car.price]);
  const carMileage = useMemo(
    () => formatMileage(car.mileage || 0),
    [car.mileage]
  );

  const isUsedCar = car.condition === "used";

  const listingCategory =
    car.listing_category === "rental" ? "For Rent" : "For Sale";

  const pathname = usePathname();

  const { profile } = useAuth();

  const pageName = getPageName(pathname);

  const logAdClickData = {
    vehicleId: car.id,
    vehicleOwnerId: car.dealer.id as string,
    sourcePage: pageName,
    viewerId: profile?.id,
  };

  const handleAdClick = async () => await logAdClick(logAdClickData);

  return (
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
      <Link href={`/cars/${isRental ? "rentals" : "sales"}/${car.id}`} passHref>
        <Box
          onClick={handleAdClick}
          onKeyDown={handleAdClick}
          tabIndex={0}
          role="button"
          p={0}
          m={0}
        >
          <VStack alignItems="flex-start">
            <Box
              position="relative"
              width={{ base: "26rem", md: "29rem" }}
              height={{ base: "18rem", md: "25rem" }}
              borderRadius="8px"
              overflow="hidden"
            >
              <Image
                src={getPublicUrl(
                  "vehicle-images",
                  car.images[0]?.image_path ?? ""
                )}
                alt={`${car.id}: Car: ${car.make}`}
                fill
                sizes="(max-width: 600px) 26rem, 29rem"
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                quality={70}
              />
            </Box>

            <Flex
              direction="column"
              justifyContent="space-between"
              width={{ base: "26rem", md: "29rem" }}
              gap="sm"
              padding="sm"
            >
              <Box>
                <Typography>{car.year}</Typography>
                <Typography
                  weight="bold"
                  variant="h3"
                  title={`${car.make}, ${car.model}`}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                    maxWidth: "100%",
                  }}
                >
                  {car.make}, {car.model}
                </Typography>
                <Flex justifyContent="space-between" gap="sm">
                  <Typography color="grey" weight="bold">
                    Mileage: {carMileage} km
                  </Typography>
                  <Typography weight="bold">{listingCategory}</Typography>
                </Flex>
              </Box>

              <Divider color="grey" />

              <Box>
                <Typography variant="h3" weight="bold" color="primaryDark">
                  {carPrice}{" "}
                  {isRental ? (
                    <Typography as="span" style={{ fontSize: "inherit" }}>
                      / per day
                    </Typography>
                  ) : (
                    ""
                  )}
                </Typography>
                <Typography>{isUsedCar ? "Pre-owned" : "Brand new"}</Typography>

                <HStack>
                  <HStack mt="sm">
                    <i
                      className="fa-solid fa-location-dot"
                      aria-hidden="true"
                      title="location"
                    ></i>
                    <Typography>{car.location}</Typography>
                  </HStack>
                  <Box
                    position="relative"
                    width="60px"
                    height="60px"
                    border="1.5px solid"
                    borderColor="greyLight"
                    borderRadius="1rem"
                    overflow="hidden"
                  >
                    <Image
                      src={
                        car.dealer.profile_logo_path
                          ? getPublicUrl(
                              "profile-logos",
                              car.dealer.profile_logo_path
                            )
                          : defaultUserIcon
                      }
                      alt={car.dealer.dealership_name ?? ""}
                      title={car.dealer.dealership_name ?? ""}
                      fill
                      loading="lazy"
                      sizes="(max-width: 600px) 60px, 60px"
                      style={{
                        objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                          String(car.dealer.dealership_name)
                        )
                          ? "contain"
                          : "cover",
                        borderRadius: "1rem",
                      }}
                      quality={70}
                    />
                  </Box>
                </HStack>
              </Box>
            </Flex>
          </VStack>
        </Box>
      </Link>
    </Box>
  );
};
