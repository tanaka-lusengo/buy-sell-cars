"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  logErrorMessage,
  StatusCode,
  toastNotifySuccess,
} from "~bsc-shared/utils";
import { logPartialTrialSubscription } from "@/src/server/actions/payment";
import { Profile, Subscription } from "@/src/types";
import { formatPriceToRands } from "@/src/utils";
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

  const { push } = useRouter();

  const isIndividual = profile.user_category === "individual";

  const noSubscription = !subscription;

  // Show submit button if:
  // 1. they are a dealership (not individual)
  // 2. They don't have a subscription
  // 3. If they do have a subscription and the status is not "active"
  const shouldShowSubmitButton =
    !isIndividual &&
    (noSubscription || (subscription && subscription.status !== "active"));

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const userConfirmed = confirm(
        `You're about to subscribe to the ${planName} plan:\n\n` +
          `Base Price: ${formatPriceToRands(basePrice)}\n` +
          `Total: ${formatPriceToRands(price)} incl. (15% VAT) per month\n\n` +
          `Do you want to proceed?`
      );

      if (userConfirmed) {
        if (noSubscription) {
          // If they don't have an existing subscription, log a trial subscription for the user
          const { status, error } = await logPartialTrialSubscription(
            profile,
            planName
          );
          if (status !== StatusCode.SUCCESS) {
            console.error("Failed to log partial trial subscription:", error);
            handleClientError(
              "Failed to log trial subscription",
              "Please try again later."
            );
            return;
          }

          toastNotifySuccess(
            `You have successfully logged a trial subscription for the ${planName} plan.`
          );
          push("/dashboard/subscriptions");
        } else {
          window.open(planLink, "_blank", "noopener,noreferrer");
        }
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
        handleSubscribe();
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
            {formatPriceToRands(basePrice)} + VAT{" "}
            <Typography as="span">/ per month</Typography>
          </Typography>
          <Typography align="center" variant="body2" color="grey">
            ({formatPriceToRands(price)} incl 15% VAT)
          </Typography>
        </Typography>

        <Flex direction="column" marginY="md" gap="md">
          <Typography align="center">
            <b>{description}</b>
          </Typography>
        </Flex>

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
                  {isLoading ? "Redirecting..." : "Get Started"}
                </Button>
              </Box>
            )}
            {!isIndividual && (
              <Typography align="center" variant="body2">
                <i>
                  Note: If you are already subscribed to a plan,{" "}
                  <b>make sure to cancel</b> your existing subscription first.
                </i>
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
          </Flex>
        </Container>
      </Box>
    </form>
  );
};
