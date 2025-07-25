"use client";

import { useEffect, useState } from "react";
import { SelectField } from "~bsc-shared/components/FormComponents";
import { Typography } from "~bsc-shared/ui";
import { handleClientError, StatusCode } from "~bsc-shared/utils";
import { getAdClicksByVehicleWithInfo } from "@/src/server/actions/analytics";
import { Flex, Box } from "@/styled-system/jsx";
import { timeFrames } from "../constants";
import { TimeFrame, AdClick } from "../types";
import { AdClicksBarChart } from "./AdClicksBarChart";

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
      <Typography variant="h3">Vehicle Ad Clicks</Typography>

      <Box maxWidth="150px">
        <SelectField
          name="timeframe"
          register={null}
          errors={null}
          value={timeframe}
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
