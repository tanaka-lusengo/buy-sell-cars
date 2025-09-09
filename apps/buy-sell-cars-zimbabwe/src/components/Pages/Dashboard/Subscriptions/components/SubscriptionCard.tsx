"use client";

import { JSX, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Typography, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  logErrorMessage,
  toastNotifySuccess,
  StatusCode,
} from "~bsc-shared/utils";
import { startStarterShowcaseTrial } from "@/src/server/actions/trial";
import { Profile, Subscription } from "@/src/types";
import { formatPriceToDollars } from "@/src/utils";
import { Box, Container, Flex } from "@/styled-system/jsx";

type SubscriptionCardProps = {
  profile: Profile;
  subscription: Subscription | null;
  planLink: string;
  planName: string;
  price: number;
  basePrice: number;
  description: string;
  features: JSX.Element[];
};

export const SubscriptionCard = ({
  profile,
  subscription,
  planLink,
  planName,
  price,
  basePrice,
  description,
  features,
}: SubscriptionCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpgradeFlow = searchParams.get("upgrade") === "true";

  const isIndividual = profile.user_category === "individual";
  const isStarterShowcase = planName.includes("Starter Showcase");

  const noSubscription = !subscription;

  const showTrialPeriodNote = isStarterShowcase && noSubscription;

  // Show submit button if:
  // 1. they are a dealership (not individual)
  // 2. They don't have a subscription
  // 3. If they do have a subscription and the status is not "active"
  // 4. If they are coming to upgrade from trial, always show the button
  const shouldShowSubmitButton =
    !isIndividual &&
    (noSubscription ||
      (subscription && subscription.status !== "active") ||
      isUpgradeFlow);

  const handleStartTrial = async () => {
    setIsLoading(true);

    try {
      const userConfirmed = confirm(
        `Start your 14-day free trial of the ${planName} plan?\n\n` +
          `You'll temporarily get full access to the subscription features.\n` +
          `No payment required. Start your free trial now?`
      );

      if (userConfirmed) {
        const { error, status } = await startStarterShowcaseTrial(profile);

        if (error || status !== StatusCode.SUCCESS) {
          return handleClientError("Starting your free trial", error);
        }

        toastNotifySuccess(
          "Your 14-day free trial has started! Welcome to BuySellCars!"
        );
        router.refresh();
        router.push("/dashboard/subscriptions");
      }
    } catch (error) {
      logErrorMessage(error, "starting trial");
      handleClientError(
        "An unexpected error occurred while starting your trial",
        "Please try again later or contact support if the issue persists."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const userConfirmed = confirm(
        `You're about to subscribe to the ${planName} plan:\n\n` +
          `Base Price: ${formatPriceToDollars(basePrice)}\n` +
          `Total: ${formatPriceToDollars(price)} incl. (15% VAT) per month\n\n` +
          `Do you want to proceed?`
      );

      if (userConfirmed) {
        window.open(planLink, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      logErrorMessage(error, "subscribing to plan");
      handleClientError(
        "An unexpected error occurred while subscribing to the plan",
        "Please try again later or contact support if the issue persists."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (showTrialPeriodNote) {
          handleStartTrial();
        } else {
          handleSubscribe();
        }
      }}
    >
      <Box
        border="1px solid"
        borderColor="greyLight"
        maxWidth="45rem"
        padding="md"
        borderRadius="1rem"
        bg="white"
        boxShadow="lg"
        style={{ transition: "transform 0.2s ease-in-out" }}
        _hover={{ transform: "scale(1.01)" }}
      >
        <Typography align="center" variant="h3">
          {planName} <br />
          <Typography
            as="span"
            color="primaryDark"
            style={{ fontSize: "inherit" }}
          >
            {formatPriceToDollars(basePrice)} + VAT{" "}
            <Typography as="span">/ per month</Typography>
          </Typography>
          <Typography align="center" variant="body2" color="grey">
            ({formatPriceToDollars(price)} incl 15% VAT)
          </Typography>
        </Typography>

        <Box marginY="md">
          <Typography align="center">
            <b>{description}</b>
          </Typography>
        </Box>

        <Typography as="ul" style={{ paddingLeft: "3.5rem" }}>
          <Flex direction="column" gap="xs">
            {features.map((feature, index) => (
              <Typography
                as="li"
                key={index}
                style={{
                  listStyleType: "disc",
                }}
              >
                {feature}
              </Typography>
            ))}
          </Flex>
        </Typography>

        <Container marginY="md">
          <Flex direction="column" gap="md">
            {shouldShowSubmitButton && (
              <Box marginX="auto" textAlign="center">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? showTrialPeriodNote
                      ? "Starting Trial..."
                      : "Redirecting..."
                    : showTrialPeriodNote
                      ? "Start 14 day Free Trial period"
                      : "Get Started"}
                </Button>
              </Box>
            )}

            {!isIndividual && (
              <Typography align="center">
                If you are already subscribed to a plan,{" "}
                <b>make sure to cancel</b> your existing subscription first.
              </Typography>
            )}

            {isIndividual && (
              <Typography align="center" variant="body2">
                <i>
                  Note: Individual users do not have access to subscription
                  plans.
                </i>
              </Typography>
            )}

            <Typography align="center" variant="body2">
              <i>
                (Note: You will be charged in South African Rands at checkout)
              </i>
            </Typography>
          </Flex>
        </Container>
      </Box>
    </form>
  );
};
