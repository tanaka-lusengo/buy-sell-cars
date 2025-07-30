import { PostgrestError } from "@supabase/supabase-js";
import Link from "next/link";
import { ResponsiveContainer, H2, H3, H4, P } from "~bsc-shared/ui";
import { StatusCode } from "~bsc-shared/utils";
import { useFileUploadHelpers } from "@/src/hooks";
import { Profile, VehicleWithImage } from "@/src/types";
import { Container, Box, Flex, Grid } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import {
  SellerImage,
  SellerContent,
} from "../../shared/VehicleDetailCard/components";
import { DealerVehicleCard } from "./components";

type DealerDetailsProps = {
  vehicles: VehicleWithImage[] | null;
  owner: Profile | null;
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const DealerDetails = ({
  vehicles,
  owner,
  error,
  status,
}: DealerDetailsProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const hasDealershipName =
    typeof owner?.dealership_name === "string" &&
    owner.dealership_name.trim().length > 0;

  const sellerName = hasDealershipName
    ? owner.dealership_name
    : `${owner?.first_name ?? ""} ${owner?.last_name ?? ""}`.trim();

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <H2>Browse: {sellerName}</H2>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <H3 color="error">Error fetching dealer and/or vehicles</H3>

              <P color="error">Please try again a later time</P>
              {error === typeof "string" && <P color="error">{error}</P>}
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles?.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" gap="sm" paddingY="lg">
              <H3 align="center" color="primaryDark">
                Sorry, it looks like we don&#39;t have any listings available
                for {owner?.dealership_name} at the moment.
              </H3>
              <H4 align="center">
                Please come back later or check out our other listings.
              </H4>
              <H4 color="primary">
                <Link href="/dealers">View all Dealers</Link>
              </H4>
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && vehicles && vehicles.length > 0 && (
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
                  direction="column"
                  top={{ base: "none", lg: "130px" }}
                  minWidth={{ base: "100%", md: "40rem" }}
                  justifyContent="center"
                  paddingX="md"
                  gap="lg"
                >
                  <SellerImage owner={owner} getPublicUrl={getPublicUrl} />
                  <SellerContent owner={owner} />
                </Flex>

                <Flex
                  flexWrap="wrap"
                  justifyContent="center"
                  gap="md"
                  paddingX="md"
                >
                  {vehicles.map((vehicle) => (
                    <DealerVehicleCard
                      key={vehicle.id}
                      owner={owner}
                      vehicle={vehicle}
                      isRental={vehicle.listing_category === "rental"}
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
