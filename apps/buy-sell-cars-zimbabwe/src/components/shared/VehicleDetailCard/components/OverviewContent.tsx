import { H3, H4, P } from "~bsc-shared/ui";
import { formatMileage, capitaliseFirstChar } from "~bsc-shared/utils";
import { VehicleWithImage } from "@/src/types";
import { Flex, HStack, Box, Grid } from "@/styled-system/jsx";

export const OverviewContent = ({ vehicle }: { vehicle: VehicleWithImage }) => {
  return (
    <>
      <Flex
        direction="column"
        marginTop="md"
        width={{ base: "29rem", sm: "55rem", md: "65rem" }}
      >
        <H3 weight="bold">Overview</H3>

        <P>{vehicle.description}</P>
      </Flex>
    </>
  );
};

export const VehicleDetails = ({ vehicle }: { vehicle: VehicleWithImage }) => {
  return (
    <Box marginTop="md">
      <H3 weight="bold">Vehicle details</H3>

      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
        borderBottom="1px solid"
        borderColor="grey"
        paddingY="sm"
        gap="lg"
      >
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-gas-pump"
              aria-hidden="true"
              title="location"
            ></i>
            <H4>Mileage:</H4>
          </HStack>
          <H4>{formatMileage(vehicle.mileage ?? 0)} km</H4>
        </HStack>

        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-star-of-life"
              aria-hidden="true"
              title="location"
            ></i>
            <H4>Condition:</H4>
          </HStack>
          <H4>{vehicle.condition === "new" ? "Brand new" : "Pre-owned"}</H4>
        </HStack>
      </Grid>

      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
        borderBottom="1px solid"
        borderColor="grey"
        paddingY="sm"
        gap="lg"
      >
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-oil-can"
              aria-hidden="true"
              title="location"
            ></i>
            <H4>Fuel type:</H4>
          </HStack>
          <H4>{capitaliseFirstChar(vehicle.fuel)}</H4>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-door-closed"
              aria-hidden="true"
              title="location"
            ></i>
            <H4>Doors: </H4>
          </HStack>
          <H4>{vehicle.doors}</H4>
        </HStack>
      </Grid>
      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
        borderBottom="1px solid"
        borderColor="grey"
        paddingY="sm"
        gap="lg"
      >
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-gear"
              aria-hidden="true"
              title="location"
            ></i>
            <H4>Gearbox:</H4>
          </HStack>
          <H4>{capitaliseFirstChar(vehicle.gear_box)}</H4>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-chair"
              aria-hidden="true"
              title="location"
            ></i>
            <H4>Seats: </H4>
          </HStack>
          <H4>{vehicle.seats}</H4>
        </HStack>
      </Grid>
    </Box>
  );
};
