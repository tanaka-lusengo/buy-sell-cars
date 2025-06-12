"use client";

import { useEffect, useState } from "react";
import { handleClientError, StatusCode } from "@/src/utils";
import { getMyProfileViewCount } from "@/src/server/actions/analytics";
import { Box, Flex } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { SelectField } from "@/src/components/FormComponents";

type TimeFrame = "7d" | "30d" | "90d" | "365d" | "all";

const timeFrames: { label: string; value: TimeFrame }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "1 Year Period", value: "365d" },
  { label: "All Time views", value: "all" },
];

export const MyProfileViewsCard = ({ profileId }: { profileId: string }) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>("30d");
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    const fetch = async () => {
      const { data, status, error } = await getMyProfileViewCount(
        profileId,
        timeframe
      );

      if (status !== StatusCode.SUCCESS || error) {
        handleClientError("fetching profile views", error);
        return;
      }

      setViewCount(data);
    };
    fetch();
  }, [profileId, timeframe]);

  return (
    <Flex
      direction="column"
      gap="sm"
      border="1px solid"
      borderColor="grey"
      padding="md"
      borderRadius="1.2rem"
      md={{ maxWidth: "fit-content" }}
    >
      <Typography as="h1" variant="h3">
        Profile Views
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

      <Typography variant="h3" weight="bold" color="primaryDark" align="center">
        {viewCount}
      </Typography>
    </Flex>
  );
};
