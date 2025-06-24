import { useMemo } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { ResponsiveContainer, Typography } from "~bsc-shared/ui";
import { StatusCode } from "~bsc-shared/utils";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { SUBSCRIPTION_FEATURE_TYPES } from "@/src/constants/values";
import { Profile } from "@/src/types";
import { filterAndSortByDealers } from "@/src/utils";
import { Container, Box, Grid, Flex, Divider } from "@/styled-system/jsx";
import { PaidSponsorFeature } from "../../shared";
import { Filter, DealerCard } from "./components";

type AllDealersProps = {
  dealers: Profile[];
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
          <Typography variant="h2">Browse our range of Dealers</Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <Typography variant="h3" color="error">
                Error fetching dealers
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

        {successStatus && dealers?.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Typography variant="h4" align="center">
                No dealers found
              </Typography>
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
          <Typography variant="h3" align="center">
            Our Sponsors
          </Typography>

          <Flex wrap="wrap" width="100%" justifyContent="center" paddingY="md">
            <PaidSponsorFeature
              href={EXTERNAL_URLS.ROSSI_TYRES_URL}
              imgSrc="/images/sponsors/rossi-tyres-sm.jpg"
              imgAlt="Rossi Tyres"
            />
            <PaidSponsorFeature
              href={EXTERNAL_URLS.ROAD_BOYS_LOGISTICS_URL}
              imgSrc="/images/sponsors/road-boys-logistics.jpg"
              imgAlt="Road Boys Logistics"
            />
          </Flex>
        </Box>
      </Container>
    </>
  );
};
