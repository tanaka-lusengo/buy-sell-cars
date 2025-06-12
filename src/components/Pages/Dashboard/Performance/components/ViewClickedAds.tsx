"use client";

import { useEffect, useState } from "react";
import { AdClicksBarChart } from "./AdClicksBarChart";
import { getAdClicksByVehicleWithInfo } from "@/src/server/actions/analytics";
import { Flex, Box } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { SelectField } from "@/src/components/FormComponents";
import { handleClientError, StatusCode } from "@/src/utils";

type TimeFrame = "7d" | "30d" | "90d" | "365d" | "all";

type AdClick = {
  make: string;
  model: string;
  year: number | null;
  clickCount: number;
  vehicleId: string;
};

const timeFrames: { label: string; value: TimeFrame }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "1 Year Period", value: "365d" },
  { label: "All Time views", value: "all" },
];

export const ViewClickedAds = ({ profileId }: { profileId: string }) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>("30d");
  const [adClicks, setAdClicks] = useState<AdClick[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error, status } = await getAdClicksByVehicleWithInfo(
        profileId,
        timeframe
      );

      if (status !== StatusCode.SUCCESS || error) {
        handleClientError("fetching ad clicks", error);
        return;
      }

      setAdClicks(data);
    };

    fetchData();
  }, [timeframe, profileId]);

  return (
    <Flex
      direction="column"
      gap="sm"
      border="1px solid"
      borderColor="grey"
      padding="md"
      borderRadius="1.2rem"
    >
      <Typography as="h1" variant="h3">
        Vehicle Ad Clicks
      </Typography>

      <Box maxWidth="150px">
        <SelectField
          name="timeframe"
          register={null}
          errors={null}
          value={timeframe}
          defaultValue={timeframe}
          onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
        >
          {timeFrames.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
      </Box>

      <AdClicksBarChart data={adClicks} />
    </Flex>
  );
};
