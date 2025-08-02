"use client";

import { useMemo } from "react";
import { Box } from "~bsc-shared";
import { FavouriteButton, H3 } from "~bsc-shared/ui";
import { useFavourites } from "@/src/context/favourites-context";
import { VehicleWithImage } from "@/src/types";
import { formatPriceToDollars } from "@/src/utils";
import { Flex } from "@/styled-system/jsx";

type VehicleTitleProps = {
  vehicle: VehicleWithImage;
  flexDirection?: "row" | "column";
};

export const VehicleTitle = ({
  vehicle,
  flexDirection = "column",
}: VehicleTitleProps) => {
  const vehiclePrice = useMemo(
    () => formatPriceToDollars(vehicle.price),
    [vehicle.price]
  );

  const isRental = vehicle.listing_category === "rental";

  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <Flex
      direction={{ base: "column", md: flexDirection }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent={flexDirection === "row" ? "space-between" : "flex-start"}
    >
      <Flex alignItems="center" gap="sm">
        <H3>
          {vehicle.make}, {vehicle.model} {vehicle.year}
        </H3>
        <FavouriteButton
          style={{ position: "relative", top: "0", right: "0" }}
          vehicleId={vehicle.id}
          isFavourite={isFavourite(vehicle.id)}
          onFavouriteToggle={toggleFavourite}
        />
      </Flex>
      <H3 color="primaryDark">
        {vehiclePrice}{" "}
        {isRental ? <span style={{ fontSize: "inherit" }}>/ per day</span> : ""}
      </H3>
    </Flex>
  );
};
