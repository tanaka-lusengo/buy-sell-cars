import { useMemo } from "react";
import { Container, Box, Flex, Grid } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography } from "../../../ui";
import { StatusCode } from "@/src/utils";
import { VehicleWithImageAndDealer } from "@/src/types";
import { PostgrestError } from "@supabase/supabase-js";
import { FeaturePreviewCard } from "@/src/components/shared";
import { Filter } from "./components/Filter";

type AllCarsProps = {
  cars: VehicleWithImageAndDealer[];
  error: string | PostgrestError | null;
  status: StatusCode;
  isRental: boolean;
};

export const AllCars = ({ cars, error, status, isRental }: AllCarsProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const carMakes = useMemo(() => {
    const makes = cars.map((car) => car.make);
    return [...new Set(makes)];
  }, [cars]);

  const carModels = useMemo(() => {
    const models = cars.map((car) => car.model);
    return [...new Set(models)];
  }, [cars]);

  const carFilterData = useMemo(() => {
    return {
      makes: carMakes,
      models: carModels,
    };
  }, [carMakes, carModels]);

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <Typography variant="h2">
            Browse cars {isRental ? "to rent" : "for sale"}
          </Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <Typography as="h2" variant="h3" color="error">
                Error fetching cars
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

        {successStatus && cars.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" gap="sm" paddingY="lg">
              <Typography variant="h3" align="center" color="primaryDark">
                Sorry, it looks like we don&#39;t have any cars available{" "}
                {isRental ? "to rent" : "for sale"} at the moment.
              </Typography>
              <Typography variant="h4" align="center">
                Please come back later or check out our other listings.
              </Typography>
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && cars.length > 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Grid
                gridTemplateColumns={{ base: "1fr", lg: "1fr 3fr" }}
                alignItems={{ base: "center", lg: "flex-start" }}
                justifyItems="center"
                gap="lg"
              >
                <Flex
                  position="sticky"
                  top={{ base: "none", lg: "130px" }}
                  minWidth={{ base: "100%", md: "40rem" }}
                  justifyContent="center"
                  paddingX="md"
                >
                  <Filter carFilterData={carFilterData} />
                </Flex>

                <Flex
                  flexWrap="wrap"
                  justifyContent="center"
                  gap="md"
                  paddingX="md"
                >
                  {cars.map((car) => (
                    <FeaturePreviewCard
                      key={car.id}
                      width="26rem"
                      height="25rem"
                      car={car}
                      isRental={isRental}
                    />
                  ))}
                </Flex>
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}
      </Container>
    </>
  );
};
