"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResponsiveContainer, H2, H3, H5, P, Typography } from "~bsc-shared/ui";
import { formatToReadableString, StatusCode } from "~bsc-shared/utils";
import roadBoysLogisticsImg from "@/public/images/sponsors/road-boys-logistics/road-boys-logistics.jpg";
import rossiTyresImg from "@/public/images/sponsors/rossi/rossi-tyres.jpg";
import {
  PaginatedVehicleList,
  PaidSponsorFeature,
} from "@/src/components/shared";
import { SPONSOR_NAMES } from "@/src/constants/sponsors";
import { SPONSOR_URL } from "@/src/constants/sponsors";
import { VehicleCategoryType, VehicleWithImageAndDealer } from "@/src/types";
import { filterVehicles, parseUrlSearchParams } from "@/src/utils";
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
  const searchParams = useSearchParams();
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const vehicleListRef = useRef<HTMLDivElement>(null);

  // Parse search parameters and apply filters
  useEffect(() => {
    const filterCriteria = parseUrlSearchParams(searchParams);
    const filtered = filterVehicles(vehicles, filterCriteria);
    setFilteredVehicles(filtered);

    // Check if user came with search parameters (from landing page search)
    const hasSearchParams = Object.values(filterCriteria).some(
      (value) => value && value.trim() !== ""
    );

    if (hasSearchParams) {
      // Smooth scroll to vehicle list when user arrives with search parameters
      setTimeout(() => {
        if (vehicleListRef.current) {
          const yOffset = -145;
          const y =
            vehicleListRef.current.getBoundingClientRect().top +
            window.scrollY +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500); // Longer delay to allow page to fully render
    }
  }, [vehicles, searchParams]);

  // Listen for filter change events from the filter component
  useEffect(() => {
    const handleFilterChange = () => {
      const newSearchParams = new URLSearchParams(window.location.search);
      const filterCriteria = parseUrlSearchParams(newSearchParams);
      const filtered = filterVehicles(vehicles, filterCriteria);
      setFilteredVehicles(filtered);

      // Smooth scroll to vehicle list with offset (matching PaginatedVehiclesList behavior)
      setTimeout(() => {
        if (vehicleListRef.current) {
          const yOffset = -145;
          const y =
            vehicleListRef.current.getBoundingClientRect().top +
            window.scrollY +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 200);
    };

    window.addEventListener("filterchange", handleFilterChange);
    return () => window.removeEventListener("filterchange", handleFilterChange);
  }, [vehicles]);

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

  const showFilterCounter =
    successStatus &&
    vehicles.length > 0 &&
    filteredVehicles.length !== vehicles.length;

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <H2>
            Browse {category()} {isRental ? "to rent" : "for sale"}
          </H2>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <H3 color="error">Error fetching {category()}</H3>

              <P color="error">
                Please try again a later time or contact support if the issue
                persists.
              </P>
              {error === typeof "string" && <P color="error">{error}</P>}
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" gap="md" paddingY="lg">
              <H3 align="center" color="primaryDark">
                Sorry, we currently don&#39;t have any {category()} available{" "}
                {isRental ? "to rent" : "for sale"} at the moment.
              </H3>
              <Box maxWidth="70rem" marginX="auto">
                <H5 align="center">
                  We&#39;re working closely with new dealers and individuals to
                  feature new listings as we speak. Please come back later or
                  check out our other listings.
                </H5>
              </Box>

              <H5 align="center">
                <Typography
                  as="span"
                  weight="bold"
                  color="primary"
                  hoverEffect="color"
                >
                  <Link href="/sign-up">Subscribe now</Link>
                </Typography>{" "}
                to become a featured dealer and showcase your vehicles here!
              </H5>
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles.length > 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Grid
                gridTemplateColumns={{ base: "1fr", lg: "1fr 3fr" }}
                alignItems={{ base: "center", lg: "flex-start" }}
                justifyItems="center"
                gap="lg"
              >
                <Flex
                  display={{ base: "none", lg: "flex" }}
                  direction="column"
                  position="sticky"
                  top={{ base: "none", lg: "130px" }}
                  minWidth={{ base: "100%", md: "40rem" }}
                  justifyContent="center"
                  paddingX="md"
                >
                  {showFilterCounter && (
                    <Box marginBottom="sm">
                      <H3>
                        Showing <b>{filteredVehicles.length}</b> of{" "}
                        <b>{vehicles.length}</b> results
                      </H3>
                    </Box>
                  )}
                  <Filter vehicleFilterData={vehicleFilterData} />
                </Flex>

                <Box>
                  <FeatureVehicles
                    isFeature
                    vehicleCategory={vehicleCategory}
                    isRental={isRental}
                    featuredCarsWithDealerDetails={featruredVehicles}
                  />

                  <PaidSponsorFeature
                    href={SPONSOR_URL.ROSSI_TYRES_URL}
                    name={SPONSOR_NAMES.ROSSI_TYRES}
                    placement={`all_vehicles_page_top_${vehicleCategory}`}
                    imgSrc={rossiTyresImg}
                    imgAlt={SPONSOR_NAMES.ROSSI_TYRES}
                  />

                  <Divider
                    ref={vehicleListRef}
                    color="grey"
                    marginBottom="lg"
                    maxWidth="100rem"
                  />

                  <PaginatedVehicleList
                    vehicles={filteredVehicles}
                    vehicleCategory={vehicleCategory}
                    isRental={isRental}
                  />
                </Box>
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles.length > 0 && (
          <PaidSponsorFeature
            href={SPONSOR_URL.ROAD_BOYS_LOGISTICS_URL}
            name={SPONSOR_NAMES.ROAD_BOYS_LOGISTICS}
            placement={`all_vehicles_page_bottom_${vehicleCategory}`}
            imgSrc={roadBoysLogisticsImg}
            imgAlt={SPONSOR_NAMES.ROAD_BOYS_LOGISTICS}
            showHeading
          />
        )}
      </Container>
    </>
  );
};
