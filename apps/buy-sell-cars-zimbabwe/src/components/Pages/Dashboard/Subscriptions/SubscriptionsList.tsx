"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "~bsc-shared/ui";
import { Profile, Subscription } from "@/src/types";
import { Box, Flex, Grid, VStack } from "@/styled-system/jsx";
import { InfoFooter } from "../components";
import { SubscriptionCard } from "./components";
import {
  starterShowcasePlan,
  growthAcceleratorPlan,
  dealershipDominatorPlan,
} from "./components/subscriptionData";

type SubscriptionsListProps = {
  profile: Profile;
  subscription: Subscription | null;
};

export const SubscriptionsList = ({
  profile,
  subscription,
}: SubscriptionsListProps) => {
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
        quality={70}
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
          <Flex direction="column" marginBottom="lg">
            <Typography variant="h2" align="center" color="white">
              Select a subscription plan
            </Typography>

            <Typography align="center" color="white">
              Choose a plan that best fits your needs to access your dashboard.
            </Typography>

            <Typography
              as="span"
              weight="bold"
              color="primary"
              hoverEffect="color"
              style={{ fontSize: "inherit" }}
            >
              By subscribing, you agree to our{" "}
              <Link href="/faqs" target="_blank">
                Payment, Refund & Cancellation Policy
              </Link>{" "}
              .
            </Typography>
          </Flex>

          <Flex
            height="fit-content"
            wrap="wrap"
            justifyContent="center"
            gap="md"
          >
            <SubscriptionCard
              profile={profile}
              subscription={subscription}
              planLink={starterShowcasePlan.planLink}
              planName={starterShowcasePlan.name}
              price={starterShowcasePlan.price}
              basePrice={starterShowcasePlan.basePrice}
              description={starterShowcasePlan.description}
              features={starterShowcasePlan.features.map((feature, index) => (
                <Typography key={index} as="span">
                  {feature}
                </Typography>
              ))}
            />

            <SubscriptionCard
              profile={profile}
              subscription={subscription}
              planLink={growthAcceleratorPlan.planLink}
              planName={growthAcceleratorPlan.name}
              price={growthAcceleratorPlan.price}
              basePrice={growthAcceleratorPlan.basePrice}
              description={growthAcceleratorPlan.description}
              features={growthAcceleratorPlan.features.map((feature, index) => (
                <Typography key={index} as="span">
                  {feature}
                </Typography>
              ))}
            />

            <SubscriptionCard
              profile={profile}
              subscription={subscription}
              planLink={dealershipDominatorPlan.planLink}
              planName={dealershipDominatorPlan.name}
              price={dealershipDominatorPlan.price}
              basePrice={dealershipDominatorPlan.basePrice}
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
