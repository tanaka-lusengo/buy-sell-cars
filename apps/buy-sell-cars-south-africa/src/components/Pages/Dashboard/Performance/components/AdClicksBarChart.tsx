"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useWindowSize } from "~bsc-shared/hooks";
import { Typography } from "~bsc-shared/ui";
import { breakpointsNumber } from "@/src/styles";
import { Divider, Flex } from "@/styled-system/jsx";
import { AdClick } from "../types";

export const AdClicksBarChart = ({ data }: { data: AdClick[] }) => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  const chartData = data
    .sort((a, b) => b.clickCount - a.clickCount)
    .map((item) => ({
      name: `${item.make} ${item.model} (${item.year ?? ""})`.trim(),
      clicks: item.clickCount,
    }));

  const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);

  if (chartData.length === 0) {
    return (
      <Flex direction="column" alignItems="center" gap="md">
        <Typography variant="h4">No Ad Clicks Data Available</Typography>
        <Typography>Come back later to check!</Typography>
      </Flex>
    );
  }

  if (isMobile) {
    return (
      <Flex direction="column" alignItems="center" gap="md">
        <Typography variant="h4">
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

        <Flex direction="column" gap="2">
          {chartData.map((item) => (
            <React.Fragment key={item.name}>
              <Flex pt="xs" justify="space-between" px="xs" gap="md">
                <Typography>{item.name}</Typography>
                <Typography weight="bold" color="primaryDark">
                  {item.clicks}
                </Typography>
              </Flex>
              <Divider color="greyLight" pb="xs" />
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartData.length * 50}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} tickCount={5} />
        <YAxis type="category" dataKey="name" width={200} />
        <Tooltip />
        <Bar dataKey="clicks" fill="#d6bd83" barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
};
