"use client";

import Link from "next/link";
import { useWindowSize } from "~bsc-shared/hooks";
import { breakpointsNumber } from "~bsc-shared/styles";
import { ResponsiveContainer, Typography } from "~bsc-shared/ui";
import { FeaturePreviewCard } from "@/src/components/shared";
import { VehicleWithImageAndDealer } from "@/src/types";
import { Container, Flex } from "@/styled-system/jsx";

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
        <Typography variant="h2">Browse more cars for sale</Typography>
      </ResponsiveContainer>

      <Container bg="greyLight" paddingY="lg" paddingX="md">
        <Flex
          direction="column"
          gap="lg"
          maxWidth={{ sm: "pageSm", md: "pageMd", lg: "pageLg", xl: "pageXl" }}
          marginX="auto"
        >
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

          <Typography
            variant="h3"
            weight="bold"
            hoverEffect="color"
            align="center"
          >
            <Link href="/car/sales/">View all cars for sale</Link>
          </Typography>
        </Flex>
      </Container>
    </>
  );
};
