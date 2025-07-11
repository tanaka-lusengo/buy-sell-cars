import React from "react";
import { Typography } from "~bsc-shared/ui";
import { Flex, Divider, HStack } from "@/styled-system/jsx";

type MobileClicksListProps = {
  data: { company: string; clicks: number }[];
  totalClicks: number;
};

export const MobileClicksList = ({
  data,
  totalClicks,
}: MobileClicksListProps) => (
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

    <Flex direction="column" gap="2" width="100%">
      {data
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
