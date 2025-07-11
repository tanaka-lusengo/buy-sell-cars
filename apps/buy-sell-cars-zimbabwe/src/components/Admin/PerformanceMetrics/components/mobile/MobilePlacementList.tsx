import React from "react";
import { Typography } from "~bsc-shared/ui";
import { formatToReadableString } from "~bsc-shared/utils";
import { Box, Divider, HStack, VStack } from "@/styled-system/jsx";
import { PlacementChartRow } from "../../types";

type MobilePlacementListProps = {
  data: PlacementChartRow[];
  placements: string[];
};

export const MobilePlacementList = ({
  data,
  placements,
}: MobilePlacementListProps) => (
  <VStack alignItems="start" gap="md">
    <Typography variant="h3">Clicks by Placement</Typography>
    {data.map((sponsor) => (
      <Box key={sponsor.company} width="100%">
        <Typography variant="h4">{sponsor.company}</Typography>
        {placements.map((placement) => (
          <HStack
            key={placement}
            justify="space-between"
            paddingY="xs"
            borderBottom="1px solid"
            borderColor="greyLight"
          >
            <Typography>
              {formatToReadableString(placement) || placement}
            </Typography>
            <Typography weight="bold" color="primaryDark">
              {(sponsor[placement] as number) ?? 0}
            </Typography>
          </HStack>
        ))}
        <Divider marginY="md" />
      </Box>
    ))}
  </VStack>
);
