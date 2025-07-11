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
import { useWindowSize } from "~bsc-shared/hooks";
import { Typography } from "~bsc-shared/ui";
import { breakpointsNumber } from "@/src/styles";
import { Box, Divider, Flex, HStack, VStack } from "@/styled-system/jsx";
import { BAR_HEIGHT, MAX_HEIGHT, MIN_HEIGHT } from "../constants";
import { PostHogSponsorAdClickData } from "../types";
import { transformSponsorClicks } from "../utils/helpers";

export const SponsorAdClicksChart = ({
  rawData,
}: {
  rawData: PostHogSponsorAdClickData[];
}) => {
  const chartData = transformSponsorClicks(rawData);

  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  const totalClicks = chartData.reduce(
    (sum: number, item: { clicks: number }) => sum + item.clicks,
    0
  );

  const calculatedHeight = Math.min(
    Math.max(chartData.length * BAR_HEIGHT, MIN_HEIGHT),
    MAX_HEIGHT
  );

  const maxClicks = Math.max(...chartData.map((item) => item.clicks));
  const yAxisTicks = Array.from({ length: maxClicks + 1 }, (_, i) => i);

  if (chartData.length === 0) {
    return (
      <VStack alignItems="center" gap="md">
        <Typography variant="h4">
          No Sponsor Ad Clicks Data Available
        </Typography>
        <Typography>Come back later to check!</Typography>
      </VStack>
    );
  }

  if (isMobile) {
    return (
      <Flex direction="column" gap="md">
        <Typography variant="h3">
          Total Ad Clicks:{" "}
          <Typography
            as="span"
            weight="bold"
            color="primaryDark"
            style={{ fontSize: "inherit" }}
          >
            {totalClicks}
          </Typography>
        </Typography>

        <Flex direction="column" gap="2" width="20rem">
          {chartData
            .sort((a, b) => b.clicks - a.clicks)
            .map((item) => (
              <React.Fragment key={item.company}>
                <HStack paddingTop="xs" justify="space-between">
                  <Typography>{item.company}</Typography>
                  <Typography weight="bold" color="primaryDark">
                    {item.clicks}
                  </Typography>
                </HStack>
                <Divider color="greyLight" pb="xs" />
              </React.Fragment>
            ))}
        </Flex>
      </Flex>
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
        <Typography variant="h3">Sponsored Ad Clicks</Typography>
      </Box>

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
    </Box>
  );
};
