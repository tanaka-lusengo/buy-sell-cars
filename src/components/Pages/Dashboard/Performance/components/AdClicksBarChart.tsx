"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { breakpointsNumber } from "@/src/styles";
import { useWindowSize } from "@/src/hooks";
import { Divider, Flex } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";

type AdClickData = {
  vehicleId: string;
  make: string;
  model: string;
  year: number | null;
  clickCount: number;
};

export const AdClicksBarChart = ({ data }: { data: AdClickData[] }) => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  const chartData = data
    .sort((a, b) => b.clickCount - a.clickCount)
    .map((item) => ({
      name: `${item.make} ${item.model} (${item.year ?? ""})`.trim(),
      clicks: item.clickCount,
    }));

  const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);

  if (isMobile) {
    return (
      <Flex direction="column" alignItems="center" gap="md">
        <Typography variant="h4">
          Total Ad Clicks:{" "}
          <Typography as="span" variant="h3" weight="bold" color="primaryDark">
            {totalClicks}
          </Typography>
        </Typography>

        <Flex direction="column" gap="2">
          {chartData.map((item) => (
            <>
              <Flex
                pt="xs"
                key={item.name}
                justify="space-between"
                px="xs"
                gap="md"
              >
                <Typography>{item.name}</Typography>
                <Typography weight="bold" color="primaryDark">
                  {item.clicks}
                </Typography>
              </Flex>
              <Divider color="greyLight" pb="xs" />
            </>
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
