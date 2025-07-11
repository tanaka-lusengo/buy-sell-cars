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
import { formatToReadableString } from "~bsc-shared/utils";
import { useResponsiveChart } from "../hooks";
import { PostHogSponsorAdClickData, PlacementChartRow } from "../types";
import {
  transformByPlacement,
  createPlacementColors,
  calculateChartHeight,
  generateAxisTicks,
} from "../utils/helpers";
import { MobilePlacementList } from "./mobile";
import { ChartContainer, EmptyState, ChartHeader } from "./shared";

export const SponsorAdPlacementChart = ({
  rawData,
}: {
  rawData: PostHogSponsorAdClickData[];
}) => {
  const chartData: PlacementChartRow[] = transformByPlacement(rawData);
  const { isMobile } = useResponsiveChart();

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
  const placementColors = createPlacementColors(placements);
  const calculatedHeight = calculateChartHeight(chartData.length);

  // Calculate max value across all placements for X-axis ticks
  const maxClicks = Math.max(
    ...chartData.flatMap((row) =>
      Object.values(row).filter((val) => typeof val === "number")
    )
  );
  const xAxisTicks = generateAxisTicks(maxClicks);

  if (chartData.length === 0) {
    return <EmptyState title="No Placement Data Available" />;
  }

  if (isMobile) {
    return <MobilePlacementList data={chartData} placements={placements} />;
  }

  return (
    <ChartContainer>
      <ChartHeader title="Clicks by Placement" />
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
    </ChartContainer>
  );
};
