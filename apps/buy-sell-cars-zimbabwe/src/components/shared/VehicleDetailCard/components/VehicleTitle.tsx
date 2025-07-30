import { useMemo } from "react";
import { H3 } from "~bsc-shared/ui";
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

  return (
    <Flex
      direction={{ base: "column", md: flexDirection }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent={flexDirection === "row" ? "space-between" : "flex-start"}
    >
      <H3>
        {vehicle.make}, {vehicle.model} {vehicle.year}
      </H3>
      <H3 color="primaryDark">
        {vehiclePrice}{" "}
        {isRental ? <span style={{ fontSize: "inherit" }}>/ per day</span> : ""}
      </H3>
    </Flex>
  );
};
