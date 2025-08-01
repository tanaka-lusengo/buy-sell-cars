import { useMemo } from "react";
import { Typography } from "~bsc-shared/ui";
import { VehicleWithImage } from "@/src/types";
import { formatPriceToRands } from "@/src/utils";
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
    () => formatPriceToRands(vehicle.price),
    [vehicle.price]
  );

  const isRental = vehicle.listing_category === "rental";

  return (
    <Flex
      direction={{ base: "column", md: flexDirection }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent={flexDirection === "row" ? "space-between" : "flex-start"}
    >
      <Typography variant="h3">
        {vehicle.make}, {vehicle.model} {vehicle.year}
      </Typography>
      <Typography variant="h3" color="primaryDark">
        {vehiclePrice}{" "}
        {isRental ? (
          <Typography as="span" style={{ fontSize: "inherit" }}>
            / per day
          </Typography>
        ) : (
          ""
        )}
      </Typography>
    </Flex>
  );
};
