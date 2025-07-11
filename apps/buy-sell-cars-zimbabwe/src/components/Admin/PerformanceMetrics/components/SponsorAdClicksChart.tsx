"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useResponsiveChart } from "../hooks";
import { PostHogSponsorAdClickData } from "../types";
import {
  transformSponsorClicks,
  calculateChartHeight,
  generateAxisTicks,
  getMaxValue,
} from "../utils/helpers";
import { MobileClicksList } from "./mobile";
import { ChartContainer, EmptyState, ChartHeader } from "./shared";

export const SponsorAdClicksChart = ({
  rawData,
}: {
  rawData: PostHogSponsorAdClickData[];
}) => {
  const chartData = transformSponsorClicks(rawData);
  const { isMobile } = useResponsiveChart();

  const totalClicks = chartData.reduce(
    (sum: number, item: { clicks: number }) => sum + item.clicks,
    0
  );

  const calculatedHeight = calculateChartHeight(chartData.length);
  const maxClicks = getMaxValue(chartData, "clicks");
  const yAxisTicks = generateAxisTicks(maxClicks);

  if (chartData.length === 0) {
    return <EmptyState title="No Sponsor Ad Clicks Data Available" />;
  }

  if (isMobile) {
    return <MobileClicksList data={chartData} totalClicks={totalClicks} />;
  }

  return (
    <ChartContainer>
      <ChartHeader title="Sponsored Ad Clicks" />
      <ResponsiveContainer width="100%" height={calculatedHeight}>
        <BarChart data={chartData}>
          <XAxis dataKey="company" />
          <YAxis
            allowDecimals={false}
            domain={[0, maxClicks]}
            ticks={yAxisTicks}
            type="number"
          />
          <Tooltip />
          <Bar dataKey="clicks" fill="#d6bd83" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
