"use client";

import { Flex } from "@/styled-system/jsx";
import { useRouter } from "next/navigation";
import { ViewClickedAds } from "./components/ViewClickedAds";
import { MyProfileViewsCard } from "./components/ViewProfileViews";
import { Button, ResponsiveContainer, Typography } from "@/src/components/ui";
import { type Profile } from "@/src/types";
import { InfoFooter } from "../components";

export const Performance = ({ profile }: { profile: Profile }) => {
  const { id, user_category } = profile;

  const isIndividual = user_category === "individual";

  const { push } = useRouter();

  return (
    <ResponsiveContainer>
      <Flex paddingY="lg" direction="column" gap="md">
        {isIndividual ? (
          <Flex direction="column" gap="md" padding="md">
            <Typography variant="h3">
              Sorry, you don&#39;t have access to Performance metrics at this
              time.
            </Typography>

            <Typography>
              To gain access to Performance metrics you must subscribe to either
              our <b>&#39;Growth Accelerator&#39;</b> or{" "}
              <b>&#39;Dealership Dominator&#39;</b> Packages
            </Typography>

            <Button onClick={() => push("/dashboard/subscriptions/select")}>
              Upgrade Now
            </Button>

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
