import { Typography } from "@/src/components/ui";
import { VehicleWithImage } from "@/src/types";
import { formatMileage, capitaliseFirstChar } from "@/src/utils";
import { Flex, HStack, Box, Grid } from "@/styled-system/jsx";

export const OverviewContent = ({ vehicle }: { vehicle: VehicleWithImage }) => {
  return (
    <>
      <Flex
        direction="column"
        marginTop="md"
        width={{ base: "29rem", sm: "55rem", md: "65rem" }}
      >
        <Typography variant="h3" weight="bold">
          Overview
        </Typography>

        <Typography>{vehicle.description}</Typography>
      </Flex>
    </>
  );
};

export const VehicleDetails = ({ vehicle }: { vehicle: VehicleWithImage }) => {
  return (
    <Box marginTop="md">
      <Typography variant="h3" weight="bold">
        Vehicle details
      </Typography>

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
            <Typography variant="h4">Mileage:</Typography>
          </HStack>
          <Typography variant="h4">
            {formatMileage(vehicle.mileage ?? 0)} km
          </Typography>
        </HStack>

        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-star-of-life"
              aria-hidden="true"
              title="location"
            ></i>
            <Typography variant="h4">Condition:</Typography>
          </HStack>
          <Typography variant="h4">
            {vehicle.condition === "new" ? "Brand new" : "Pre-owned"}
          </Typography>
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
            <Typography variant="h4">Fuel type:</Typography>
          </HStack>
          <Typography variant="h4">
            {capitaliseFirstChar(vehicle.fuel)}
          </Typography>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-door-closed"
              aria-hidden="true"
              title="location"
            ></i>
            <Typography variant="h4">Doors: </Typography>
          </HStack>
          <Typography variant="h4">{vehicle.doors}</Typography>
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
            <Typography variant="h4">Gearbox:</Typography>
          </HStack>
          <Typography variant="h4">
            {capitaliseFirstChar(vehicle.gear_box)}
          </Typography>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack>
            <i
              className="fa-solid fa-chair"
              aria-hidden="true"
              title="location"
            ></i>
            <Typography variant="h4">Seats: </Typography>
          </HStack>
          <Typography variant="h4">{vehicle.seats}</Typography>
        </HStack>
      </Grid>
    </Box>
  );
};
