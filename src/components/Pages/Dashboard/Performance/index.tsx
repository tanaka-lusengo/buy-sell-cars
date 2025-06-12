"use client";

import { Flex } from "@/styled-system/jsx";
import { ViewClickedAds } from "./components/ViewClickedAds";
import { MyProfileViewsCard } from "./components/ViewProfileViews";
import { ResponsiveContainer } from "@/src/components/ui";

export const Performance = ({ profileId }: { profileId: string }) => {
  return (
    <ResponsiveContainer>
      <Flex paddingY="lg" direction="column" gap="md">
        <ViewClickedAds profileId={profileId} />
        <MyProfileViewsCard profileId={profileId} />
      </Flex>
    </ResponsiveContainer>
  );
};
