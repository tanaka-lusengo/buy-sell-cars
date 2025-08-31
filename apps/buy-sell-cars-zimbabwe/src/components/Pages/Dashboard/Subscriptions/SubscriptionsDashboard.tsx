"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  Button,
  H2,
  H3,
  H4,
  P,
  PSmall,
  Span,
} from "~bsc-shared/ui";
import {
  capitaliseFirstChar,
  formatDate,
  generateIcon,
  handleClientError,
  logErrorMessage,
  StatusCode,
  toastNotifyInfo,
} from "~bsc-shared/utils";
import { managePaystackSubscription } from "@/src/server/actions/payment";
import { Profile, Subscription, VehicleWithImage } from "@/src/types";
import { formatPriceToDollars } from "@/src/utils";
import {
  getRemainingTrialDays,
  hasTrialExpired,
  hasActiveTrialAccess,
} from "@/src/utils/trialHelpers";
import { Box, Flex, Grid, Divider } from "@/styled-system/jsx";
import { InfoFooter } from "../components";
import {
  starterShowcasePlan,
  growthAcceleratorPlan,
  dealershipDominatorPlan,
} from "./components/subscriptionData";

type SubscriptionsDashboardProps = {
  profile: Profile;
  subscription: Subscription | null;
  vehicles: VehicleWithImage[];
};

export const SubscriptionsDashboard = ({
  profile,
  subscription,
  vehicles,
}: SubscriptionsDashboardProps) => {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  if (!profile) {
    return null;
  }

  const { user_category } = profile;
  const { subscription_name, start_time, status, cancel_time } =
    subscription || {};

  const isCancelled = cancel_time !== null;
  const isIndividual = user_category === "individual";
  const subscriptionPlanName = subscription_name || "No Plan Selected";
  const isTrialActive = hasActiveTrialAccess(subscription);

  const remainingTrialDays = getRemainingTrialDays(subscription);
  const trialExpired = hasTrialExpired(subscription);

  const subscriptionPlan = isIndividual
    ? "Individual Plan (Free)"
    : isTrialActive
      ? `${subscriptionPlanName} (Trial - ${remainingTrialDays} days left)`
      : subscriptionPlanName;

  const currentListingCount = vehicles.length || 0;

  // Get current plan details
  const getCurrentPlanDetails = () => {
    if (isIndividual) return null;

    if (subscription_name?.includes("Starter Showcase")) {
      return starterShowcasePlan;
    } else if (subscription_name?.includes("Growth Accelerator")) {
      return growthAcceleratorPlan;
    } else if (subscription_name?.includes("Dealership Dominator")) {
      return dealershipDominatorPlan;
    }
    return null;
  };

  const currentPlanDetails = getCurrentPlanDetails();

  // Get vehicle limits based on subscription
  const getVehicleLimits = () => {
    if (isIndividual) return { current: currentListingCount, max: 2 };

    if (subscription_name?.includes("Starter Showcase")) {
      return { current: currentListingCount, max: 25 };
    } else if (subscription_name?.includes("Growth Accelerator")) {
      return { current: currentListingCount, max: 75 };
    } else if (subscription_name?.includes("Dealership Dominator")) {
      return { current: currentListingCount, max: 100 };
    }
    return { current: currentListingCount, max: 0 };
  };

  const vehicleLimits = getVehicleLimits();

  const handleManageSubscription = async () => {
    if (!subscription?.subscription_code) {
      toastNotifyInfo("You must have a valid subscription before managing it.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, status, error } = await managePaystackSubscription(
        subscription.subscription_code
      );

      if (!data || error || status !== StatusCode.SUCCESS) {
        console.error("Failed to manage subscription:", error);
        return;
      }

      window.open(data.link, "_blank", "noopener,noreferrer");
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

  const renderButtonState = () => {
    if (isIndividual) {
      return (
        <P>
          <i>Individual users do not have a subscription plan.</i>
        </P>
      );
    } else if (subscription) {
      return (
        <Button type="button" onClick={handleManageSubscription}>
          {isLoading ? "Processing..." : "Manage Subscription"}
        </Button>
      );
    } else {
      return null;
    }
  };

  const renderCurrentPlanFeatures = () => {
    if (!currentPlanDetails || isIndividual) return null;

    return (
      <Flex direction="column" gap="md">
        <H3>Your Plan Features</H3>
        <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="md">
          <Flex direction="column" gap="md">
            <H4>What&apos;s Included:</H4>
            <Flex direction="column" gap="sm">
              {currentPlanDetails.features.map((feature, index) => (
                <P key={index}>
                  {generateIcon("check")} {feature}
                </P>
              ))}
            </Flex>
          </Flex>

          <Flex direction="column" gap="md">
            <H4>Plan Details:</H4>
            <Flex direction="column" gap="sm">
              <Flex justifyContent="space-between">
                <P>Monthly Price:</P>
                <P weight="bold" color="primary">
                  {formatPriceToDollars(currentPlanDetails.price)}
                </P>
              </Flex>
              <Flex justifyContent="space-between">
                <P>Base Price:</P>
                <P>{formatPriceToDollars(currentPlanDetails.basePrice)}</P>
              </Flex>
              <Flex justifyContent="space-between">
                <P>VAT (15%):</P>
                <P>
                  {formatPriceToDollars(
                    currentPlanDetails.price - currentPlanDetails.basePrice
                  )}
                </P>
              </Flex>
              <Flex justifyContent="space-between">
                <P>Vehicle Limit:</P>
                <P weight="bold">{vehicleLimits.max} vehicles</P>
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </Flex>
    );
  };

  const renderUsageStatistics = () => {
    if (isIndividual) {
      return (
        <Flex direction="column" marginY="lg" gap="md">
          <H3>Your Usage</H3>
          <Box
            border="1px solid"
            borderColor="blue"
            borderRadius="md"
            padding="md"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <P>Vehicle Listings:</P>
              <P weight="bold">
                {vehicleLimits.current} / {vehicleLimits.max} vehicles
              </P>
            </Flex>
            <PSmall color="grey">
              Individual users can list up to 2 vehicles for free
            </PSmall>
          </Box>
        </Flex>
      );
    }

    if (!subscription) {
      return (
        <Flex marginY="lg" direction="column" gap="md">
          <H3>Get Started</H3>
          <Flex
            direction="column"
            bg="greyLight"
            border="1px solid"
            borderColor="greyLight"
            borderRadius="1.2rem"
            padding="md"
            gap="sm"
          >
            <P>
              Choose a subscription plan to start listing vehicles and access
              premium features:
            </P>

            <Box paddingLeft="lg">
              <P>- List multiple vehicles</P>

              <P>- Featured listings</P>

              <P>- Priority placement</P>

              <P>- Performance Analytics</P>
            </Box>
          </Flex>
        </Flex>
      );
    }

    return (
      <Flex marginY="lg" direction="column" gap="md">
        <H3>Usage Statistics</H3>
        <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="md">
          <Box
            border="1px solid"
            borderColor="green"
            borderRadius="1rem"
            padding="md"
            textAlign="center"
          >
            <H2 color="green" weight="bold">
              {vehicleLimits.current}
            </H2>
            <P color="green">Active Listings</P>
            <PSmall color="grey">of {vehicleLimits.max} allowed</PSmall>
          </Box>

          <Box
            border="1px solid"
            borderColor="primaryDark"
            borderRadius="1rem"
            padding="md"
            textAlign="center"
          >
            <H2 color="primaryDark" weight="bold">
              {subscription?.status === "active"
                ? isTrialActive
                  ? "Trial Active"
                  : "Active"
                : "Inactive"}
            </H2>
            <P color="primaryDark">Subscription Status</P>
            <PSmall color="grey">
              {isTrialActive ? `Trial subscription` : "Full subscription"}
            </PSmall>
          </Box>
        </Grid>
      </Flex>
    );
  };

  const renderBillingInformation = () => {
    if (isIndividual || !subscription) return null;

    return (
      <Flex marginY="lg" direction="column" gap="md">
        <H3>Billing Information</H3>
        <Box
          bg="grey.50"
          border="1px solid"
          borderColor="grey"
          borderRadius="1rem"
          padding="md"
        >
          <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="md">
            <Flex direction="column" gap="sm">
              <Flex justifyContent="space-between">
                <P>Billing Email:</P>
                <P weight="bold">{profile.email}</P>
              </Flex>
              <Flex justifyContent="space-between">
                <P>Customer Code:</P>
                <P>{subscription.customer_code || "N/A"}</P>
              </Flex>
              <Flex justifyContent="space-between">
                <P>Subscription Code:</P>
                <P>{subscription.subscription_code || "N/A"}</P>
              </Flex>
            </Flex>

            <Flex direction="column" gap="sm">
              {!isCancelled && start_time && (
                <Flex justifyContent="space-between">
                  <P>Started On:</P>
                  <P weight="bold">{formatDate(start_time)}</P>
                </Flex>
              )}

              {isCancelled && cancel_time && (
                <Flex justifyContent="space-between">
                  <P>Cancelled On:</P>
                  <P weight="bold" color="error">
                    {formatDate(cancel_time)}
                  </P>
                </Flex>
              )}

              <Flex justifyContent="space-between">
                <P>Billing Frequency:</P>
                <P weight="bold">Monthly</P>
              </Flex>
            </Flex>
          </Grid>
        </Box>
      </Flex>
    );
  };

  const renderPlanComparison = () => {
    if (isIndividual) return null;

    const plans = [
      { ...starterShowcasePlan, limit: 25, featured: 1 },
      { ...growthAcceleratorPlan, limit: 75, featured: 3 },
      { ...dealershipDominatorPlan, limit: 100, featured: 5 },
    ];

    return (
      <Box marginY="lg">
        <H3>Compare Plans</H3>

        {/* Mobile view - stacked cards */}
        <Box display={{ base: "block", md: "none" }} marginTop="sm">
          <Grid gap="md">
            {plans.map((plan) => (
              <Box
                key={plan.name}
                border="1px solid"
                borderColor="grey"
                borderRadius="1.2rem"
                padding="md"
                bg={
                  subscription_name?.includes(plan.name.split(" (")[0])
                    ? "primary"
                    : "white"
                }
                color={
                  subscription_name?.includes(plan.name.split(" (")[0])
                    ? "white"
                    : "black"
                }
              >
                <Flex direction="column" gap="sm">
                  <Flex justifyContent="space-between" alignItems="center">
                    <H4 weight="bold">{plan.name.split(" (")[0]}</H4>
                    <H4 weight="bold">{formatPriceToDollars(plan.price)}/mo</H4>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <P>Vehicle Listings:</P>
                    <P weight="bold">{plan.limit} vehicles</P>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <P>Featured Listings:</P>
                    <P weight="bold">
                      {plan.featured} listing{plan.featured > 1 ? "s" : ""}
                    </P>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <P>Logo Display:</P>
                    <P weight="bold">✓</P>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <P>Priority Placement:</P>
                    <P weight="bold">
                      {plan.name.includes("Starter") ? "-" : "✓"}
                    </P>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <P>Performance Analytics:</P>
                    <P weight="bold">
                      {plan.name.includes("Starter") ? "-" : "✓"}
                    </P>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Desktop view - table format */}
        <Box
          display={{ base: "none", md: "block" }}
          marginTop="sm"
          overflowX="auto"
        >
          <Box minWidth="600px">
            <Grid
              gridTemplateColumns="1fr 1fr 1fr 1fr"
              gap="xs"
              marginBottom="sm"
              padding="sm"
            >
              <P weight="bold">Feature</P>
              {plans.map((plan) => (
                <Box
                  key={plan.name}
                  padding="sm"
                  bg={
                    subscription_name?.includes(plan.name.split(" (")[0])
                      ? "primary"
                      : "greyLight"
                  }
                  color={
                    subscription_name?.includes(plan.name.split(" (")[0])
                      ? "white"
                      : "black"
                  }
                  textAlign="center"
                  borderRadius="1rem"
                >
                  <P weight="bold">{plan.name.split(" (")[0]}</P>
                  <P>{formatPriceToDollars(plan.price)}/mo</P>
                </Box>
              ))}
            </Grid>

            {/* Comparison rows */}
            <Box
              border="1px solid"
              borderColor="grey"
              borderRadius="1rem"
              overflow="hidden"
            >
              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                bg="greyLight"
                padding="sm"
              >
                <P weight="bold">Vehicle Listings</P>
                {plans.map((plan) => (
                  <P key={plan.name} align="center">
                    {plan.limit} vehicles
                  </P>
                ))}
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <P weight="bold">Featured Listings</P>
                {plans.map((plan) => (
                  <P key={plan.name} align="center">
                    {plan.featured} listing{plan.featured > 1 ? "s" : ""}
                  </P>
                ))}
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                bg="grey.50"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <P weight="bold">Logo Display</P>
                <P align="center">✓</P>
                <P align="center">✓</P>
                <P align="center">✓</P>
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <P weight="bold">Priority Placement</P>
                <P align="center">-</P>
                <P align="center">✓</P>
                <P align="center">✓</P>
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                bg="grey.50"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <P weight="bold">Performance Analytics</P>
                <P align="center">-</P>
                <P align="center">✓</P>
                <P align="center">✓</P>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <ResponsiveContainer>
      <Flex direction="column" padding="lg" gap="md">
        <Box>
          <H2>Subscription Dashboard</H2>
          <P>
            Manage your subscription plans and view detailed billing
            information.
          </P>
        </Box>

        {/* Current Plan Status */}
        <Flex direction="column" gap="sm" paddingY="sm">
          <H4>
            Current Plan:{" "}
            <Span color="primary" weight="bold" style={{ fontSize: "inherit" }}>
              {subscriptionPlan}
            </Span>
          </H4>

          {subscription && !isIndividual && (
            <>
              {isCancelled ? (
                <P>
                  Cancelled at:{" "}
                  <strong>{cancel_time ? formatDate(cancel_time) : ""}</strong>
                </P>
              ) : (
                <P>
                  Subscription start:{" "}
                  <strong>{start_time ? formatDate(start_time) : "TBC"}</strong>
                </P>
              )}
              <P>
                Status:{" "}
                <strong>
                  {status ? capitaliseFirstChar(status) : "Pending Start"}
                </strong>
              </P>
            </>
          )}
        </Flex>

        {/* Trial Status Banner */}
        {isTrialActive && !isIndividual && (
          <Box
            border="1px solid"
            borderColor={remainingTrialDays <= 7 ? "orange" : "blue"}
            borderRadius="1rem"
            padding="md"
            marginY="md"
          >
            <Flex direction="column" gap="sm">
              <H4 color={remainingTrialDays <= 7 ? "orange" : "blue"}>
                🚀 Trial Active - {remainingTrialDays} days remaining
              </H4>
              <P>
                You&apos;re currently on a 14-day free trial of the{" "}
                <b>{subscriptionPlanName}</b>.
                {remainingTrialDays <= 7
                  ? " Your trial is ending soon - upgrade now to keep access to all features!"
                  : " Upgrade anytime to continue enjoying all features after your trial ends."}
              </P>
              {remainingTrialDays <= 7 && (
                <Button
                  onClick={() =>
                    push("/dashboard/subscriptions/view?upgrade=true")
                  }
                  size="sm"
                >
                  Upgrade Now
                </Button>
              )}
            </Flex>
          </Box>
        )}

        {trialExpired && !isIndividual && (
          <Box
            border="1px solid"
            borderColor="red"
            borderRadius="1rem"
            padding="md"
            marginY="md"
          >
            <Flex direction="column" gap="sm">
              <H4 color="error">⚠️ Trial Expired</H4>
              <P>
                Your 14-day trial has ended. Upgrade to a paid plan to regain
                access to vehicle listings and dashboard features.
              </P>
              <Button
                onClick={() =>
                  push("/dashboard/subscriptions/view?upgrade=true")
                }
                size="sm"
              >
                Upgrade Now
              </Button>
            </Flex>
          </Box>
        )}

        {/* Action Buttons */}
        <Flex gap="md" wrap="wrap">
          {renderButtonState()}

          <Button
            onClick={() => push("/dashboard/subscriptions/view?upgrade=true")}
          >
            See Available Plans
          </Button>
        </Flex>

        <Divider marginY="lg" />

        {/* Current Plan Features */}
        {renderCurrentPlanFeatures()}

        {/* Usage Statistics */}
        {renderUsageStatistics()}

        {/* Billing Information */}
        {renderBillingInformation()}

        {/* Plan Comparison */}
        {renderPlanComparison()}

        <InfoFooter />
      </Flex>
    </ResponsiveContainer>
  );
};
