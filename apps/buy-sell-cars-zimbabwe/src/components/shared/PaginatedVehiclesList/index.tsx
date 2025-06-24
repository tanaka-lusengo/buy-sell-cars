"use client";

import { useRef, useState } from "react";
import { Typography } from "~bsc-shared/ui";
import { FeaturePreviewCard } from "@/src/components/shared";
import { VehicleCategoryType, VehicleWithImageAndDealer } from "@/src/types";
import { Box, Flex } from "@/styled-system/jsx";
import { PrevButton, NextButton } from "./ButtonComponents";

type PaginatedVehicleListProps = {
  vehicles: VehicleWithImageAndDealer[];
  vehicleCategory: VehicleCategoryType[number];
  isRental: boolean;
};

export const PaginatedVehicleList = ({
  vehicles,
  vehicleCategory,
  isRental,
}: PaginatedVehicleListProps) => {
  const ITEMS_PER_PAGE = 12;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);

  const currentVehicles = vehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const prevBtnDisabled = currentPage === 1;
  const nextBtnDisabled = currentPage === totalPages;

  const topRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);

    setTimeout(() => {
      if (topRef.current) {
        const yOffset = -145;
        const y =
          topRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200);
  };

  return (
    <Box ref={topRef}>
      <Flex
        flexWrap="wrap"
        justifyContent="center"
        gap="md"
        paddingX="md"
        paddingBottom="lg"
      >
        {currentVehicles.map((vehicle) => (
          <FeaturePreviewCard
            key={vehicle.id}
            vehicleCategory={vehicleCategory}
            width="26rem"
            height="25rem"
            vehicle={vehicle}
            isRental={isRental}
          />
        ))}
      </Flex>

      <Flex
        justifyContent="center"
        alignItems="center"
        gap="md"
        paddingBottom="lg"
      >
        <PrevButton
          isDisabled={prevBtnDisabled}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        <Typography variant="h4" weight="bold">
          {currentPage} / {totalPages}
        </Typography>

        <NextButton
          isDisabled={nextBtnDisabled}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Flex>
    </Box>
  );
};
