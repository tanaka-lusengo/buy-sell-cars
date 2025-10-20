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
import { startCommunityAccess } from "@/src/server/actions/trial";
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
  const isCommunityAccess = planName.includes("Community Access");

  const noSubscription = !subscription;


  const isFreeAccess = isCommunityAccess && noSubscription;

  // Check if user is already subscribed to this specific plan
  const isCurrentPlan =
    subscription?.subscription_name === planName &&
    subscription?.status === "active";

  // Show submit button if:
  // 1. they are a dealership (not individual)
  // 2. They are NOT already subscribed to this specific plan
  // 3. They don't have a subscription
  // 4. If they do have a subscription and the status is not "active"
  // 5. If they are coming to upgrade from trial, always show the button (unless it's the current plan)
  const shouldShowSubmitButton =
    !isIndividual &&
    !isCurrentPlan &&
    (noSubscription ||
      (subscription && subscription.status !== "active") ||
      isUpgradeFlow);

  const handleStartCommunityAccess = async () => {
    setIsLoading(true);

    try {
      const userConfirmed = confirm(
        `Subscribe to Community Access\n\n` +
          `You'll get access to list up to 20 vehicles.\n` +
          `No payment required. Get started now?`
      );

      if (userConfirmed) {
        const { error, status } = await startCommunityAccess(profile);

        if (error || status !== StatusCode.SUCCESS) {
          return handleClientError("Starting Community Access", error);
        }

        toastNotifySuccess(
          "Community Access activated! Welcome to BuySellCars!"
        );
        router.refresh();
        router.push("/dashboard/subscriptions");
      }
    } catch (error) {
      logErrorMessage(error, "starting Community Access");
      handleClientError(
        "An unexpected error occurred while activating Community Access",
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
        if (isFreeAccess) {
          handleStartCommunityAccess();
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
          {isCommunityAccess ? (
            <Typography
              as="span"
              color="success"
              style={{ fontSize: "inherit" }}
            >
              FREE
            </Typography>
          ) : (
            <>
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
            </>
          )}
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
            {isCurrentPlan && (
              <Button disabled color="black">
                ✓ Current Plan
              </Button>
            )}

            {shouldShowSubmitButton && (
              <Box marginX="auto" textAlign="center">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isFreeAccess
                      ? "Activating..."
                      : "Redirecting..."
                    : isFreeAccess
                      ? "Get Community Access"
                      : "Get Started"}
                </Button>
              </Box>
            )}

            {!isIndividual && !isCommunityAccess && !isCurrentPlan && (
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

            {!isCommunityAccess && (
              <Typography align="center" variant="body2">
                <i>
                  (Note: You will be charged in South African Rands at checkout)
                </i>
              </Typography>
            )}
          </Flex>
        </Container>
      </Box>
    </form>
  );
};
