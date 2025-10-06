"use client";

import { useRouter } from "next/navigation";
import { ResponsiveContainer, Typography, Button } from "~bsc-shared/ui";
import { SubscriptionTypeNames } from "@/src/constants/subscription";
import type { Profile, Subscription } from "@/src/types";
import { Flex } from "@/styled-system/jsx";
import { InfoFooter } from "../components";
import { ViewClickedAds } from "./components/ViewClickedAds";
import { MyProfileViewsCard } from "./components/ViewProfileViews";

type PerformanceProps = {
  profile: Profile;
  subscription: Subscription | null;
};

export const Performance = ({ profile, subscription }: PerformanceProps) => {
  const { id, user_category } = profile;

  const isIndividual = user_category === "individual";
  const isStarterShowcase =
    subscription?.subscription_name === SubscriptionTypeNames.StarterShowcase;

  const doesNotHaveAccess = isIndividual || isStarterShowcase;

  const { push } = useRouter();

  return (
    <ResponsiveContainer>
      <Flex paddingY="lg" direction="column" gap="md">
        {doesNotHaveAccess ? (
          <Flex direction="column" gap="md" padding="md">
            <Typography variant="h3">
              Sorry, you don&#39;t have access to Performance metrics at this
              time.
            </Typography>

            <Typography>
              To gain access to Performance metrics you must subscribe to either
              our <b>&#39;Growth Accelerator&#39;</b> or{" "}
              <b>&#39;Dealership Dominator&#39;</b> Packages.
            </Typography>

            <Flex justify="center">
              <Button onClick={() => push("/dashboard/subscriptions/view")}>
                Upgrade Now
              </Button>
            </Flex>

            <InfoFooter />
          </Flex>
        ) : (
          <>
            <ViewClickedAds profileId={id} />
            <MyProfileViewsCard profileId={id} />
          </>
        )}
      </Flex>
    </ResponsiveContainer>
  );
};
