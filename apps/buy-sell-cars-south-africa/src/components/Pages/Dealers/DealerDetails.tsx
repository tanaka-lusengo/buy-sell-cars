import { Container, Box, Flex, Grid } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography } from "@/src/components/ui";
import { StatusCode } from "@/src/utils";
import { Profile, VehicleWithImage } from "@/src/types";
import { PostgrestError } from "@supabase/supabase-js";
import {
  SellerImage,
  SellerContent,
} from "../../shared/VehicleDetailCard/components";
import { createClient } from "@/supabase/client";
import { useFileUploadHelpers } from "@/src/hooks";
import { DealerVehicleCard } from "./components";
import Link from "next/link";

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
          <Typography variant="h2">Browse: {sellerName}</Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <Typography variant="h3" color="error">
                Error fetching dealer and/or vehicles
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

        {successStatus && vehicles?.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" gap="sm" paddingY="lg">
              <Typography variant="h3" align="center" color="primaryDark">
                Sorry, it looks like we don&#39;t have any listings available
                for {owner?.dealership_name} at the moment.
              </Typography>
              <Typography variant="h4" align="center">
                Please come back later or check out our other listings.
              </Typography>
              <Typography variant="h4" color="primary">
                <Link href="/dealers">View all Dealers</Link>
              </Typography>
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
