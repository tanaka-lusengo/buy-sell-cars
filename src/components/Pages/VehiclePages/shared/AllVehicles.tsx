import { useMemo } from "react";
import { Container, Box, Flex, Grid } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography } from "../../../ui";
import { formatToReadableString, StatusCode } from "@/src/utils";
import { VehicleCategoryType, VehicleWithImageAndDealer } from "@/src/types";
import { PostgrestError } from "@supabase/supabase-js";
import {
  FeaturePreviewCard,
  PaidSponsorFeature,
} from "@/src/components/shared";
// import { Filter } from "./components/Filter";

type AllVehiclesProps = {
  vehicleCategory: VehicleCategoryType[number];
  vehicles: VehicleWithImageAndDealer[];
  error: string | PostgrestError | null;
  status: StatusCode;
  isRental: boolean;
};

export const AllVehicles = ({
  vehicleCategory,
  vehicles,
  error,
  status,
  isRental,
}: AllVehiclesProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  // const vehicleMakes = useMemo(() => {
  //   const makes = vehicles.map((vehicle) => vehicle.make);
  //   return [...new Set(makes)];
  // }, [vehicles]);

  // const vehicleModels = useMemo(() => {
  //   const models = vehicles.map((vehicle) => vehicle.model);
  //   return [...new Set(models)];
  // }, [vehicles]);

  // const vehicleFilterData = useMemo(() => {
  //   return {
  //     makes: vehicleMakes,
  //     models: vehicleModels,
  //   };
  // }, [vehicleMakes, vehicleModels]);

  const category = () => {
    if (vehicleCategory === "earth_moving") {
      return "Earth Moving Equipment";
    }
    if (vehicleCategory === "agriculture") {
      return "Agricultural Equipment";
    }
    if (["truck", "bike", "car"].includes(vehicleCategory)) {
      return `${formatToReadableString(vehicleCategory)}s`;
    }
    return formatToReadableString(vehicleCategory);
  };

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <Typography variant="h2">
            Browse {category()} {isRental ? "to rent" : "for sale"}
          </Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <Typography as="h2" variant="h3" color="error">
                Error fetching bikes
              </Typography>

              <Typography color="error">
                Please try again a later time
              </Typography>
              {error === typeof "string" && (
                <Typography color="error">{error}</Typography>
              )}
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" gap="md" paddingY="lg">
              <Typography variant="h3" align="center" color="primaryDark">
                Sorry, we currently don&#39;t have any {category()} available{" "}
                {isRental ? "to rent" : "for sale"} at the moment.
              </Typography>
              <Box maxWidth="70rem" marginX="auto">
                <Typography variant="h4" align="center">
                  We&#39;re working closely with new dealers and individuals to
                  feature new listings as we speak. Please come back later or
                  check out our other listings.
                </Typography>
              </Box>
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles.length > 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Grid
                // gridTemplateColumns={{ base: "1fr", lg: "1fr 3fr" }}
                alignItems={{ base: "center", lg: "flex-start" }}
                justifyItems="center"
                gap="lg"
              >
                {/* <Flex
                  position="sticky"
                  top={{ base: "none", lg: "130px" }}
                  minWidth={{ base: "100%", md: "40rem" }}
                  justifyContent="center"
                  paddingX="md"
                >
                  <Filter vehicleFilterData={vehicleFilterData} />
                </Flex> */}

                <Flex
                  flexWrap="wrap"
                  justifyContent="center"
                  gap="md"
                  paddingX="md"
                >
                  {vehicles.map((vehicle) => (
                    <FeaturePreviewCard
                      key={vehicle.id}
                      vehicleCategory={vehicleCategory}
                      width="26rem"
                      height="25rem"
                      vehicle={vehicle}
                      isRental={isRental}
                    />
                  ))}
                </Flex>
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}

        <PaidSponsorFeature />
      </Container>
    </>
  );
};
