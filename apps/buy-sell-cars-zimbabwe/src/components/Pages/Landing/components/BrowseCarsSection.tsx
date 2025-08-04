"use client";

import Link from "next/link";
import { Grid } from "~bsc-shared";
import { useWindowSize } from "~bsc-shared/hooks";
import { breakpointsNumber } from "~bsc-shared/styles";
import { ResponsiveContainer, H2, H3 } from "~bsc-shared/ui";
import { FeaturePreviewCard } from "@/src/components/shared";
import { VehicleWithImageAndDealer } from "@/src/types";
import { Container, Flex } from "@/styled-system/jsx";
import { Filter } from "./Filter";

export const BrowseCarsSection = ({
  allCarsForSaleWithDealerDetails,
}: {
  allCarsForSaleWithDealerDetails: VehicleWithImageAndDealer[] | undefined;
}) => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.sm;
  const isTablet = (width ?? 0) < breakpointsNumber.lg;
  const cardWidth = isMobile ? "100%" : isTablet ? "20rem" : "25rem";
  const cardheight = isMobile ? "100%" : isTablet ? "20rem" : "25rem";

  return (
    <>
      <ResponsiveContainer paddingY="lg">
        <H2>Browse more cars for sale</H2>
      </ResponsiveContainer>

      <Container bg="greyLight" paddingY="lg" paddingX="md">
        <Grid
          gridTemplateColumns={{ base: "1fr", xl: "30% 70%" }}
          gap="sm"
          maxWidth={{
            sm: "pageSm",
            md: "pageMd",
            lg: "pageLg",
            xl: "pageXl",
          }}
          marginX="auto"
        >
          <Container
            display="block"
            position={{ xl: "sticky" }}
            top="130px"
            alignSelf="start"
            height="fit-content"
            marginBottom="md"
          >
            <Filter />
          </Container>
          <Flex direction="column" gap="lg">
            <Flex justifyContent="center" wrap="wrap" gap="lg">
              {allCarsForSaleWithDealerDetails?.map((car, index) => (
                <FeaturePreviewCard
                  key={index}
                  vehicleCategory="car"
                  height={cardWidth}
                  width={cardheight}
                  vehicle={car}
                  isRental={false}
                />
              ))}
            </Flex>

            <H3 weight="bold" hoverEffect="color" align="center">
              <Link href="/car/sales/">View all cars for sale</Link>
            </H3>
          </Flex>
        </Grid>
      </Container>
    </>
  );
};
