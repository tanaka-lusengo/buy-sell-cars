import { Container, Box, Flex } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography } from "../../../ui";
import { VehicleDetailCard } from "@/src/components/shared";
import { generateIcon, StatusCode } from "@/src/utils";
import { Profile, VehicleWithImage } from "@/src/types";
import { PostgrestError } from "@supabase/supabase-js";
import Link from "next/link";

type VehicleDetailsProps = {
  vehicle: VehicleWithImage | null;
  allVehiclesByOwner?: VehicleWithImage[] | null;
  owner: Profile | null;
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const VehicleDetails = ({
  vehicle,
  allVehiclesByOwner,
  owner,
  error,
  status,
}: VehicleDetailsProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const isRental = vehicle?.listing_category === "rental";

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <Flex alignItems="center" gap="0.5rem">
            {/* Wrapping both the icon and the text inside the Link to make them clickable */}
            <Link href={isRental ? "/cars/rentals/" : "/cars/sales/"}>
              <Flex
                alignItems="center"
                gap="0.5rem"
                borderBottom="2px solid"
                borderColor="primary"
                _hover={{
                  opacity: 0.8,
                  transition: "border-color 0.2s ease-in-out",
                }}
              >
                {/* Clickable arrow icon */}
                {generateIcon("arrow-left")}
                {/* Clickable text */}
                <Typography variant="h4">
                  {`Back to ${isRental ? "rental" : "sales"} results`}
                </Typography>
              </Flex>
            </Link>
          </Flex>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md">
              <Typography as="h2" variant="h3" color="error">
                Error fetching car
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

        {successStatus && !vehicle && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Typography variant="h4" align="center">
                No vehicle found
              </Typography>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && vehicle && (
          <VehicleDetailCard
            vehicle={vehicle}
            allVehiclesByOwner={allVehiclesByOwner}
            owner={owner}
          />
        )}
      </Container>
    </>
  );
};
