"use client";

import { useEffect, useState } from "react";
import { SelectField, SuspenseLoader } from "~bsc-shared/components";
import { Typography } from "~bsc-shared/ui";
import { handleClientError, StatusCode } from "~bsc-shared/utils";
import { fetchSponsorAdClicks, TimeFrame } from "@/src/lib/posthog/endpoints";
import { Box, Flex } from "@/styled-system/jsx";
import { SponsorAdClicksChart, SponsorAdPlacementChart } from "./components";
import { timeFrames } from "./constants";
import { PostHogSponsorAdClickData } from "./types";

export const PerformanceMetrics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<TimeFrame>("7 days");
  const [sponsorAdClicks, setSponsorAdClicks] = useState<
    PostHogSponsorAdClickData[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error, status } = await fetchSponsorAdClicks(timeframe);

        if (status !== StatusCode.SUCCESS || error) {
          handleClientError("fetching sponsor ad clicks", "");
          console.error("Error fetching sponsor ad clicks:", error);
          return;
        }

        setSponsorAdClicks(data || []);
      } catch (error) {
        console.error("Error fetching sponsor ad clicks:", error);
        handleClientError(
          "fetching sponsor ad clicks",
          "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  if (isLoading) {
    return <SuspenseLoader />;
  }

  return (
    <Flex direction="column" align="start" gap="md" padding="lg">
      <Flex direction="column" gap="sm">
        <Typography variant="h2">Performance Metrics</Typography>

        <Typography>View your sponsor&#39;s performance metrics.</Typography>
      </Flex>

      <Box maxWidth="150px" marginBottom="lg">
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

      <Flex direction="column" gap="lg" width="100%">
        <SponsorAdClicksChart rawData={sponsorAdClicks} />
        <SponsorAdPlacementChart rawData={sponsorAdClicks} />
      </Flex>
    </Flex>
  );
};
