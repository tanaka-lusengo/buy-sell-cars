"use client";

import { JSX, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { H3, P, PSmall, Span, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  logErrorMessage,
  StatusCode,
  toastNotifySuccess,
} from "~bsc-shared/utils";
import { logPartialTrialSubscription } from "@/src/server/actions/payment";
import { startCommunityAccess } from "@/src/server/actions/trial";
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
          router.push("/dashboard/subscriptions");
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
        <H3 align="center">
          {planName} <br />
          {isCommunityAccess ? (
            <Span color="success" style={{ fontSize: "inherit" }}>
              FREE
            </Span>
          ) : (
            <>
              <Span color="primaryDark" style={{ fontSize: "inherit" }}>
                {formatPriceToRands(basePrice)} + VAT <Span>/ per month</Span>
              </Span>
              <PSmall align="center" color="grey">
                ({formatPriceToRands(price)} incl 15% VAT)
              </PSmall>
            </>
          )}
        </H3>

        <Flex direction="column" marginY="md" gap="md">
          <P align="center">
            <b>{description}</b>
          </P>
        </Flex>

        <div style={{ paddingLeft: "3.5rem" }}>
          <Flex direction="column" gap="xs">
            {features.map((feature, index) => (
              <P
                key={index}
                style={{
                  listStyleType: "disc",
                  display: "list-item",
                }}
              >
                {feature}
              </P>
            ))}
          </Flex>
        </div>

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
              <PSmall align="center">
                <i>
                  Note: If you are already subscribed to a plan,{" "}
                  <b>make sure to cancel</b> your existing subscription first.
                </i>
              </PSmall>
            )}
            {isIndividual && (
              <PSmall align="center">
                <i>
                  Note: Individual users do not have access to subscription
                  plans.
                </i>
              </PSmall>
            )}
            {!isCommunityAccess && (
              <PSmall align="center">
                <i>
                  (Note: You will be charged in South African Rands at checkout)
                </i>
              </PSmall>
            )}
          </Flex>
        </Container>
      </Box>
    </form>
  );
};
