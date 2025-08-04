"use client";

import { useMemo, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FavouriteButton, H3, P, Typography } from "~bsc-shared/ui";
import { formatMileage, getPageName } from "~bsc-shared/utils";
import defaultUserIcon from "@/public/images/default-user-icon.png";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import { useAuth } from "@/src/context/auth-context";
import { useFavourites } from "@/src/context/favourites-context";
import { useFileUploadHelpers } from "@/src/hooks";
import { logAdClick } from "@/src/server/actions/analytics";
import { fetchUserProfile } from "@/src/server/actions/auth";
import {
  Profile,
  VehicleCategoryType,
  VehicleWithImage,
  VehicleWithImageAndDealer,
} from "@/src/types";
import { formatPriceToDollars } from "@/src/utils";
import { Box, Divider, Flex, HStack, VStack } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";

type VehiclePreviewCardProps = {
  vehicleCategory: VehicleCategoryType[number];
  vehicle: VehicleWithImageAndDealer | VehicleWithImage;
  isRental: boolean;
  width?: string;
  height?: string;
  owner?: Profile | null;
  isFeature?: boolean;
};

export const FeaturePreviewCard = ({
  vehicleCategory,
  width = "31rem",
  height = "31rem",
  vehicle,
  owner,
  isRental,
  isFeature = false,
}: VehiclePreviewCardProps) => {
  const supabase = createClient();
  const [profileImageSrc, setProfileImageSrc] = useState<
    string | StaticImageData
  >(defaultUserIcon);

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const vehiclePrice = useMemo(
    () => formatPriceToDollars(vehicle.price || 0),
    [vehicle.price]
  );
  const vehicleMileage = useMemo(
    () => formatMileage(vehicle.mileage || 0),
    [vehicle.mileage]
  );

  useEffect(() => {
    const loadProfileImage = async () => {
      // If the vehicle has a dealer and the dealer has a profile logo, use it
      if ("dealer" in vehicle && vehicle.dealer?.profile_logo_path) {
        setProfileImageSrc(
          getPublicUrl("profile-logos", vehicle.dealer.profile_logo_path)
        );
        return;
      }

      // If owner prop has profile logo, use it
      if (owner?.profile_logo_path) {
        setProfileImageSrc(
          getPublicUrl("profile-logos", owner.profile_logo_path)
        );
        return;
      }

      // Only make API call if we don't have profile data from dealer or owner prop
      try {
        const ownerProfile = await fetchUserProfile(vehicle.owner_id);
        if (ownerProfile?.profile_logo_path) {
          setProfileImageSrc(
            getPublicUrl("profile-logos", ownerProfile.profile_logo_path)
          );
        } else {
          setProfileImageSrc(defaultUserIcon);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setProfileImageSrc(defaultUserIcon);
      }
    };

    loadProfileImage();
  }, [vehicle, owner, getPublicUrl]);

  const isUsedvehicle = vehicle.condition === "used";

  const listingCategory =
    vehicle.listing_category === "rental" ? "For Rent" : "For Sale";

  const slug =
    vehicleCategory === "earth_moving" ? "earth-moving" : vehicleCategory;

  const pathname = usePathname();

  const { profile } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();

  const pageName = getPageName(pathname);

  const vehicleOwnerId = "dealer" in vehicle ? vehicle?.dealer?.id : owner?.id;

  const logAdClickData = {
    vehicleId: vehicle.id,
    vehicleOwnerId: vehicleOwnerId as string,
    sourcePage: pageName,
    viewerId: profile?.id,
  };

  const handleAdClick = async () => await logAdClick(logAdClickData);

  return (
    <Box
      bg="white"
      border={isFeature ? "3.5px solid" : "none"}
      borderColor={isFeature ? "primary" : "grey"}
      borderRadius="1.2rem"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      _hover={{
        cursor: "pointer",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        transform: "scale(1.01)",
      }}
      transition="all 0.3s ease-in-out"
    >
      <Link
        href={`/${slug}/${isRental ? "rentals" : "sales"}/${vehicle.id}`}
        passHref
      >
        <Box
          onClick={handleAdClick}
          onKeyDown={handleAdClick}
          tabIndex={0}
          role="button"
          p={0}
          m={0}
        >
          <VStack alignItems="center" padding="sm">
            <Box
              display="flex"
              justifyItems="center"
              position="relative"
              width={{ base: "26rem", md: width }}
              height={{ base: "18rem", md: height }}
              borderRadius="8px"
              overflow="hidden"
            >
              <Image
                src={getPublicUrl(
                  "vehicle-images",
                  vehicle.images[0]?.image_path ?? ""
                )}
                alt={`${vehicle.id}: vehicle: ${vehicle.make}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                quality={70}
              />
              <FavouriteButton
                vehicleId={vehicle.id}
                isFavourite={isFavourite(vehicle.id)}
                onFavouriteToggle={toggleFavourite}
              />
            </Box>

            <Flex
              padding="sm"
              direction="column"
              justifyContent="space-between"
              gap="sm"
              width={{ base: "26rem", md: width }}
            >
              <Box>
                <P>{vehicle.year}</P>

                <Flex direction="column" gap="sm">
                  <H3
                    weight="bold"
                    title={`${vehicle.make}, ${vehicle.model}`}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                      maxWidth: "100%",
                    }}
                  >
                    {vehicle.make}, {vehicle.model}
                  </H3>

                  <Flex justifyContent="space-between" gap="sm">
                    <P color="grey" weight="bold">
                      Mileage: {vehicleMileage} km
                    </P>
                    <P weight="bold">{listingCategory}</P>
                  </Flex>
                </Flex>
              </Box>

              <Divider color="grey" />

              <Box>
                <H3 weight="bold" color="primaryDark">
                  {vehiclePrice}{" "}
                  {isRental ? (
                    <Typography as="span" style={{ fontSize: "inherit" }}>
                      / per day
                    </Typography>
                  ) : (
                    ""
                  )}
                </H3>
                <P>{isUsedvehicle ? "Pre-owned" : "Brand new"}</P>

                <HStack alignItems="end" justifyContent="space-between">
                  <HStack>
                    <i
                      className="fa-solid fa-location-dot"
                      aria-hidden="true"
                      title="location"
                    ></i>
                    <P>{vehicle.location}</P>
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
                      src={profileImageSrc}
                      alt={
                        "dealer" in vehicle && vehicle.dealer?.dealership_name
                          ? vehicle.dealer.dealership_name
                          : owner?.dealership_name || "profile logo"
                      }
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                          String(
                            "dealer" in vehicle &&
                              vehicle.dealer?.dealership_name
                              ? vehicle.dealer.dealership_name
                              : owner?.dealership_name || ""
                          )
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
