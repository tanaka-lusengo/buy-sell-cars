"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useWindowSize } from "~bsc-shared/hooks";
import { Typography } from "~bsc-shared/ui";
import { formatToReadableString } from "~bsc-shared/utils";
import { breakpointsNumber } from "@/src/styles";
import { Box, Divider, HStack, VStack } from "@/styled-system/jsx";
import { BAR_HEIGHT, MAX_HEIGHT, MIN_HEIGHT } from "../constants";
import { PostHogSponsorAdClickData, PlacementChartRow } from "../types";
import { transformByPlacement, createPlacementColors } from "../utils/helpers";

export const SponsorAdPlacementChart = ({
  rawData,
}: {
  rawData: PostHogSponsorAdClickData[];
}) => {
  const chartData: PlacementChartRow[] = transformByPlacement(rawData);

  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  // Get all unique placements across all sponsors
  const allPlacements = new Set<string>();
  chartData.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "company") {
        allPlacements.add(key);
      }
    });
  });

  const placements = Array.from(allPlacements);

  // Create dynamic color mapping for placements
  const placementColors = createPlacementColors(placements);

  const calculatedHeight = Math.min(
    Math.max(chartData.length * BAR_HEIGHT, MIN_HEIGHT),
    MAX_HEIGHT
  );

  // Calculate max value across all placements for X-axis ticks
  const maxClicks = Math.max(
    ...chartData.flatMap((row) =>
      Object.values(row).filter((val) => typeof val === "number")
    )
  );
  const xAxisTicks = Array.from({ length: maxClicks + 1 }, (_, i) => i);

  if (chartData.length === 0) {
    return (
      <VStack alignItems="center" gap="md">
        <Typography variant="h4">No Placement Data Available</Typography>
        <Typography>Come back later to check!</Typography>
      </VStack>
    );
  }

  if (isMobile) {
    return (
      <VStack alignItems="start" gap="md">
        <Typography variant="h3">Clicks by Placement</Typography>
        {chartData.map((sponsor) => (
          <Box key={sponsor.company} width="100%">
            <Typography variant="h4">{sponsor.company}</Typography>
            {placements.map((placement) => (
              <HStack
                key={placement}
                justify="space-between"
                paddingY="xs"
                borderBottom="1px solid"
                borderColor="greyLight"
              >
                <Typography>
                  {formatToReadableString(placement) || placement}
                </Typography>
                <Typography weight="bold" color="primaryDark">
                  {(sponsor[placement] as number) ?? 0}
                </Typography>
              </HStack>
            ))}
            <Divider marginY="md" />
          </Box>
        ))}
      </VStack>
    );
  }

  return (
    <Box
      width="100%"
      padding="md"
      maxHeight={MAX_HEIGHT}
      overflowY="auto"
      border="1px solid"
      borderColor="grey"
      borderRadius="1.2rem"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      transition="0.3s ease-in-out"
      _hover={{
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box marginBottom="md">
        <Typography variant="h3">Clicks by Placement</Typography>
      </Box>

      <ResponsiveContainer width="100%" height={calculatedHeight}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <XAxis
            type="number"
            allowDecimals={false}
            domain={[0, maxClicks]}
            ticks={xAxisTicks}
          />
          <YAxis type="category" dataKey="company" />
          <Tooltip />
          <Legend />
          {placements.map((placement) => (
            <Bar
              key={placement}
              dataKey={placement}
              fill={placementColors[placement] || "#999"}
              name={formatToReadableString(placement)}
              radius={[0, 12, 12, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
