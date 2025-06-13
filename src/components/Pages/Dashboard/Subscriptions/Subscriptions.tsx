"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Box, Flex, Grid, VStack } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { Profile } from "@/src/types";
import { InfoFooter, SubscriptionCard } from "../components";
import {
  starterShowcasePlan,
  growthAcceleratorPlan,
  dealershipDominatorPlan,
} from "./subscriptionData";

export const Subscriptions = ({ profile }: { profile: Profile }) => {
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <Box position="relative" height="100vh" overflow="hidden">
      <Image
        src="/images/car-headlight.png"
        alt="Red car headlight"
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        priority
      />

      <Grid gridTemplateColumns={{ base: "1fr", sm: "100%" }} height="100%">
        <VStack
          height="100vh"
          overflowY="auto"
          paddingTop="xl"
          paddingBottom="lg"
          paddingX="md"
          zIndex={1}
        >
          <Box marginBottom="xl">
            <Typography variant="h2" align="center" color="white">
              Select a subscription plan
            </Typography>

            <Typography align="center" color="white">
              Choose a plan that best fits your needs to access your dashboard.
            </Typography>
          </Box>

          <Flex
            height="fit-content"
            wrap="wrap"
            justifyContent="center"
            gap="md"
          >
            <SubscriptionCard
              profile={profile}
              planId={starterShowcasePlan.planId}
              planName={starterShowcasePlan.name}
              price={starterShowcasePlan.price}
              description={starterShowcasePlan.description}
              features={starterShowcasePlan.features.map((feature, index) => (
                <Typography key={index} as="span">
                  {feature}
                </Typography>
              ))}
            />

            <SubscriptionCard
              profile={profile}
              planId={growthAcceleratorPlan.planId}
              planName={growthAcceleratorPlan.name}
              price={growthAcceleratorPlan.price}
              description={growthAcceleratorPlan.description}
              features={growthAcceleratorPlan.features.map((feature, index) => (
                <Typography key={index} as="span">
                  {feature}
                </Typography>
              ))}
            />

            <SubscriptionCard
              profile={profile}
              planId={dealershipDominatorPlan.planId}
              planName={dealershipDominatorPlan.name}
              price={dealershipDominatorPlan.price}
              description={dealershipDominatorPlan.description}
              features={dealershipDominatorPlan.features.map(
                (feature, index) => (
                  <Typography key={index} as="span">
                    {feature}
                  </Typography>
                )
              )}
            />
          </Flex>

          <InfoFooter color="white" />
        </VStack>
      </Grid>
    </Box>
  );
};
