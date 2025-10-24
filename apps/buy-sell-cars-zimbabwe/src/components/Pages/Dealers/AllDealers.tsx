"use client";

import { useMemo } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { ResponsiveContainer, H2, H3, H4, P } from "~bsc-shared/ui";
import { StatusCode } from "~bsc-shared/utils";
import roadBoysLogisticsImg from "@/public/images/sponsors/road-boys-logistics/road-boys-logistics.jpg";
import rossiTyresImg from "@/public/images/sponsors/rossi/rossi-tyres.jpg";
import { SPONSOR_NAMES } from "@/src/constants/sponsors";
import { SPONSOR_URL } from "@/src/constants/sponsors";
import { SUBSCRIPTION_FEATURE_TYPES } from "@/src/constants/subscription";
import { ProfileWithSubscription } from "@/src/types";
import { filterAndSortByDealers } from "@/src/utils";
import { Container, Box, Grid, Flex, Divider } from "@/styled-system/jsx";
import { PaidSponsorFeature } from "../../shared";
import { Filter, DealerCard } from "./components";

type AllDealersProps = {
  dealers: ProfileWithSubscription[];
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const AllDealers = ({ dealers, error, status }: AllDealersProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const dealerNames = useMemo(
    () => dealers.map((dealer) => dealer.dealership_name ?? "") || [],
    [dealers]
  );

  const filteredFeaturedDealers = filterAndSortByDealers(
    dealers,
    SUBSCRIPTION_FEATURE_TYPES,
    true
  );

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <H2>Browse our range of Dealers</H2>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <H3 color="error">Error fetching dealers</H3>

              <P color="error">Please try again a later time</P>
              {error === typeof "string" && <P color="error">{error}</P>}
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && dealers?.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <H4 align="center">No dealers found</H4>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && dealers && dealers.length > 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Grid
                // gridTemplateColumns={{ base: "1fr", lg: "1fr 3fr" }}
                alignItems={{ base: "center", lg: "flex-start" }}
                justifyItems="center"
                gap="md"
              >
                {/* TODO: When implementing filter post MVP */}
                <Flex
                  display="none"
                  position="sticky"
                  top={{ base: "none", lg: "130px" }}
                  minWidth={{ base: "100%", md: "35rem" }}
                  justifyContent="center"
                  paddingX="md"
                >
                  <Filter dealers={dealerNames} />
                </Flex>

                {/* Featured Dealers base on Subscription type */}
                {filteredFeaturedDealers.length > 0 && (
                  <>
                    <Flex
                      flexWrap="wrap"
                      justifyContent="center"
                      gap="md"
                      paddingX="md"
                    >
                      {filteredFeaturedDealers.map((dealer) => (
                        <DealerCard
                          key={dealer.id}
                          dealer={dealer}
                          isFeature={true}
                        />
                      ))}
                    </Flex>

                    <Divider color="grey" marginY="md" maxWidth="100rem" />
                  </>
                )}

                <Flex
                  flexWrap="wrap"
                  justifyContent="center"
                  gap="md"
                  paddingX="md"
                >
                  {filterAndSortByDealers(
                    dealers,
                    SUBSCRIPTION_FEATURE_TYPES
                  ).map((dealer) => (
                    <DealerCard key={dealer.id} dealer={dealer} />
                  ))}
                </Flex>
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}

        <Box paddingY="lg">
          <H3 align="center">Our Sponsors</H3>

          <Flex wrap="wrap" width="100%" justifyContent="center" paddingY="md">
            <PaidSponsorFeature
              href={SPONSOR_URL.ROSSI_TYRES_URL}
              name={SPONSOR_NAMES.ROSSI_TYRES}
              placement="all_dealers_page"
              imgSrc={rossiTyresImg}
              imgAlt={SPONSOR_NAMES.ROSSI_TYRES}
            />
            <PaidSponsorFeature
              href={SPONSOR_URL.ROAD_BOYS_LOGISTICS_URL}
              name={SPONSOR_NAMES.ROAD_BOYS_LOGISTICS}
              placement="all_dealers_page"
              imgSrc={roadBoysLogisticsImg}
              imgAlt={SPONSOR_NAMES.ROAD_BOYS_LOGISTICS}
            />
          </Flex>
        </Box>
      </Container>
    </>
  );
};
