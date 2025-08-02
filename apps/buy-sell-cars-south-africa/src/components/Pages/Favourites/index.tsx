"use client";

import { useEffect, useState } from "react";
import { Flex, generateIcon } from "~bsc-shared";
import { H2, H3, P, ResponsiveContainer } from "~bsc-shared/ui";
import { FeaturePreviewCard } from "@/src/components/shared";
import { SuspenseLoader } from "@/src/components/shared";
import { useFavourites } from "@/src/context/favourites-context";
import { fetchAllProfiles } from "@/src/server/actions/auth";
import { getVehiclesByIds } from "@/src/server/actions/general";
import { VehicleWithImageAndDealer } from "@/src/types";
import { Box, VStack } from "@/styled-system/jsx";

export const FavouritesPage = () => {
  const { favourites, isLoaded, getFavouritesCount } = useFavourites();
  const [favouriteVehicles, setFavouriteVehicles] = useState<
    VehicleWithImageAndDealer[]
  >([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  useEffect(() => {
    const loadFavouriteVehicles = async () => {
      if (!isLoaded || favourites.length === 0) {
        setFavouriteVehicles([]);
        return;
      }

      setIsLoadingVehicles(true);
      try {
        // Get favourite vehicles and dealers
        const [favouriteVehiclesResponse, allProfiles] = await Promise.all([
          getVehiclesByIds(favourites),
          fetchAllProfiles(),
        ]);

        if (favouriteVehiclesResponse?.data && allProfiles) {
          // Add dealer details to each vehicle
          const vehiclesWithDealers: VehicleWithImageAndDealer[] =
            favouriteVehiclesResponse.data.map((vehicle) => {
              const dealer = allProfiles.find(
                (dealer) => dealer.id === vehicle.owner_id
              );

              return {
                ...vehicle,
                dealer: {
                  id: dealer?.id || "",
                  dealership_name: dealer?.dealership_name || "Unknown Dealer",
                  profile_logo_path: dealer?.profile_logo_path || null,
                  subscription: null,
                },
              };
            });

          setFavouriteVehicles(vehiclesWithDealers);
        }
      } catch (error) {
        console.error("Error loading favourite vehicles:", error);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    loadFavouriteVehicles();
  }, [favourites, isLoaded]);

  if (!isLoaded || isLoadingVehicles) {
    return (
      <ResponsiveContainer minHeight="70vh" paddingY="lg">
        <Flex
          minHeight="70vh"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <SuspenseLoader label="Loading saved vehicles..." />
        </Flex>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer minHeight="70vh" paddingY="lg">
      <VStack gap="xl" alignItems="flex-center">
        <Box>
          <H2 weight="bold" color="primaryDark">
            My Favourites
          </H2>
          <Box mt="sm">
            <P color="grey">
              {getFavouritesCount()} vehicle
              {getFavouritesCount() !== 1 ? "s" : ""} saved
            </P>
          </Box>
        </Box>

        {favourites.length === 0 ? (
          <Box
            textAlign="center"
            py="3xl"
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box fontSize="4xl" mb="md" opacity={0.5}>
              {generateIcon("heart", true)}
            </Box>
            <Box mb="sm">
              <H3 color="grey">No favourites yet</H3>
            </Box>
            <Box maxW="md" textAlign="center">
              <P color="grey">
                Start browsing vehicles and click the heart icon to save your
                favourites. They&apos;ll appear here for easy access later.
              </P>
            </Box>
          </Box>
        ) : (
          <Flex justifyContent="center" wrap="wrap" gap="lg">
            {favouriteVehicles.map((vehicle) => (
              <FeaturePreviewCard
                key={vehicle.id}
                width="28rem"
                height="28rem"
                vehicleCategory={vehicle.vehicle_category!}
                vehicle={vehicle}
                isRental={vehicle.listing_category === "rental"}
              />
            ))}
          </Flex>
        )}
      </VStack>
    </ResponsiveContainer>
  );
};
