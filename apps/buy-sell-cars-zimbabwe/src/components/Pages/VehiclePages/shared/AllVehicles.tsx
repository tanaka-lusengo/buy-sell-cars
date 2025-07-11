import { useMemo } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import Link from "next/link";
import { ResponsiveContainer, Typography } from "~bsc-shared/ui";
import { formatToReadableString, StatusCode } from "~bsc-shared/utils";
import roadBoysLogisticsImg from "@/public/images/sponsors/road-boys-logistics/road-boys-logistics.jpg";
import rossiTyresImgLg from "@/public/images/sponsors/rossi/rossi-tyres-lg.jpg";
import {
  PaginatedVehicleList,
  PaidSponsorFeature,
} from "@/src/components/shared";
import { SPONSOR_NAMES } from "@/src/constants/sponsors";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { VehicleCategoryType, VehicleWithImageAndDealer } from "@/src/types";
import { Container, Box, Flex, Grid, Divider } from "@/styled-system/jsx";
import { FeatureVehicles } from "./components/FeatureVehicles";
import { Filter } from "./components/Filter";

type AllVehiclesProps = {
  vehicleCategory: VehicleCategoryType[number];
  vehicles: VehicleWithImageAndDealer[];
  featruredVehicles: VehicleWithImageAndDealer[];
  error: string | PostgrestError | null;
  status: StatusCode;
  isRental: boolean;
};

export const AllVehicles = ({
  vehicleCategory,
  vehicles,
  featruredVehicles,
  error,
  status,
  isRental,
}: AllVehiclesProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const vehicleMakes = useMemo(() => {
    const makes = vehicles.map((vehicle) => vehicle.make);
    return [...new Set(makes)];
  }, [vehicles]);

  const vehicleModels = useMemo(() => {
    const models = vehicles.map((vehicle) => vehicle.model);
    return [...new Set(models)];
  }, [vehicles]);

  const vehicleFilterData = useMemo(() => {
    return {
      makes: vehicleMakes,
      models: vehicleModels,
    };
  }, [vehicleMakes, vehicleModels]);

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
              <Typography variant="h3" color="error">
                Error fetching {category()}
              </Typography>

              <Typography color="error">
                Please try again a later time or contact support if the issue
                persists.
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
                <Typography variant="h5" align="center">
                  We&#39;re working closely with new dealers and individuals to
                  feature new listings as we speak. Please come back later or
                  check out our other listings.
                </Typography>
              </Box>

              <Typography variant="h5" align="center">
                <Typography
                  as="span"
                  weight="bold"
                  variant="h5"
                  color="primary"
                  hoverEffect="color"
                >
                  <Link href="/sign-up">Subscribe now</Link>
                </Typography>{" "}
                to become a featured dealer and showcase your vehicles here!
              </Typography>
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
                <Flex
                  display="none"
                  position="sticky"
                  top={{ base: "none", lg: "130px" }}
                  minWidth={{ base: "100%", md: "40rem" }}
                  justifyContent="center"
                  paddingX="md"
                >
                  <Filter vehicleFilterData={vehicleFilterData} />
                </Flex>

                <FeatureVehicles
                  isFeature
                  vehicleCategory={vehicleCategory}
                  isRental={isRental}
                  featuredCarsWithDealerDetails={featruredVehicles}
                />

                <PaidSponsorFeature
                  href={EXTERNAL_URLS.ROSSI_TYRES_URL}
                  name={SPONSOR_NAMES.ROSSI_TYRES}
                  placement={`all_vehicles_page_top_${vehicleCategory}`}
                  imgSrc={rossiTyresImgLg}
                  imgAlt="Rossi Tyres Logistics"
                />

                <Divider color="grey" marginTop="md" maxWidth="100rem" />

                <PaginatedVehicleList
                  vehicles={vehicles}
                  vehicleCategory={vehicleCategory}
                  isRental={isRental}
                />
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles.length > 0 && (
          <PaidSponsorFeature
            href={EXTERNAL_URLS.ROAD_BOYS_LOGISTICS_URL}
            name={SPONSOR_NAMES.ROAD_BOYS_LOGISTICS}
            placement={`all_vehicles_page_bottom_${vehicleCategory}`}
            imgSrc={roadBoysLogisticsImg}
            imgAlt="Road Boys Logistics"
            showHeading
          />
        )}
      </Container>
    </>
  );
};
