"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, Typography, Button } from "~bsc-shared/ui";
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
import { Profile, Subscription } from "@/src/types";
import { formatPriceToRands, isWithinTrialPeriod } from "@/src/utils";
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
};

export const SubscriptionsDashboard = ({
  profile,
  subscription,
}: SubscriptionsDashboardProps) => {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  if (!profile) {
    return null;
  }

  const { user_category } = profile;
  const { subscription_name, start_time, status, cancel_time, trial_ends_at } =
    subscription || {};

  const isCancelled = cancel_time !== null;
  const isIndividual = user_category === "individual";
  const subscriptionPlanName = subscription_name || "No Plan Selected";
  const isInTrial =
    subscription && trial_ends_at && isWithinTrialPeriod(subscription);

  const subscriptionPlan = isIndividual
    ? "Individual Plan (Free)"
    : subscriptionPlanName;

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
    if (isIndividual) return { current: 0, max: 2 };

    if (subscription_name?.includes("Starter Showcase")) {
      return { current: 0, max: 25 };
    } else if (subscription_name?.includes("Growth Accelerator")) {
      return { current: 0, max: 75 };
    } else if (subscription_name?.includes("Dealership Dominator")) {
      return { current: 0, max: 100 };
    }
    return { current: 0, max: 0 };
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
        <Typography>
          <i>Individual users do not have a subscription plan.</i>
        </Typography>
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

  const renderTrialInfo = () => {
    if (!isInTrial || !trial_ends_at) return null;

    return (
      <Box border="1px solid" borderRadius="1rem" padding="md" marginY="md">
        <Typography variant="h4" color="secondary" weight="bold">
          {generateIcon("calendar-days")} Trial Period Active
        </Typography>
        <Typography>
          Your trial period ends on <strong>{formatDate(trial_ends_at)}</strong>
          . See available plans below and subscribe before this date to continue
          enjoying your plan benefits.
        </Typography>
      </Box>
    );
  };

  const renderCurrentPlanFeatures = () => {
    if (!currentPlanDetails || isIndividual) return null;

    return (
      <Flex direction="column" marginY="lg" gap="md">
        <Typography variant="h3">Your Plan Features</Typography>
        <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="md">
          <Flex direction="column" gap="md">
            <Typography variant="h4">What&apos;s Included:</Typography>
            <Flex direction="column" gap="sm">
              {currentPlanDetails.features.map((feature, index) => (
                <Typography key={index}>
                  {generateIcon("check")} {feature}
                </Typography>
              ))}
            </Flex>
          </Flex>

          <Flex direction="column" gap="md">
            <Typography variant="h4">Plan Details:</Typography>
            <Flex direction="column" gap="sm">
              <Flex justifyContent="space-between">
                <Typography>Monthly Price:</Typography>
                <Typography weight="bold" color="primary">
                  {formatPriceToRands(currentPlanDetails.price)}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between">
                <Typography>Base Price:</Typography>
                <Typography>
                  {formatPriceToRands(currentPlanDetails.basePrice)}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between">
                <Typography>VAT (15%):</Typography>
                <Typography>
                  {formatPriceToRands(
                    currentPlanDetails.price - currentPlanDetails.basePrice
                  )}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between">
                <Typography>Vehicle Limit:</Typography>
                <Typography weight="bold">
                  {vehicleLimits.max} vehicles
                </Typography>
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
          <Typography variant="h3">Your Usage</Typography>
          <Box
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            borderRadius="md"
            padding="md"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Typography>Vehicle Listings:</Typography>
              <Typography weight="bold">
                {vehicleLimits.current} / {vehicleLimits.max} vehicles
              </Typography>
            </Flex>
            <Typography variant="body2" color="grey">
              Individual users can list up to 2 vehicles for free
            </Typography>
          </Box>
        </Flex>
      );
    }

    if (!subscription) {
      return (
        <Flex marginY="lg" direction="column" gap="md">
          <Typography variant="h3">Get Started</Typography>
          <Box
            bg="yellow.50"
            border="1px solid"
            borderColor="yellow.200"
            borderRadius="md"
            padding="md"
          >
            <Typography>
              Choose a subscription plan to start listing vehicles and access
              premium features:
            </Typography>
            <Box paddingLeft="lg">
              <Box style={{ listStyleType: "disc" }}>
                <Typography>List multiple vehicles</Typography>
              </Box>
              <Box style={{ listStyleType: "disc" }}>
                <Typography>Featured listings</Typography>
              </Box>
              <Box style={{ listStyleType: "disc" }}>
                <Typography>Priority placement</Typography>
              </Box>
              <Box style={{ listStyleType: "disc" }}>
                <Typography>Performance reports</Typography>
              </Box>
            </Box>
          </Box>
        </Flex>
      );
    }

    return (
      <Flex marginY="lg" direction="column" gap="md">
        <Typography variant="h3">Usage Statistics</Typography>
        <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap="md">
          <Box
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            borderRadius="md"
            padding="md"
            textAlign="center"
          >
            <Typography variant="h2" color="green" weight="bold">
              {vehicleLimits.current}
            </Typography>
            <Typography color="green">Active Listings</Typography>
            <Typography variant="body2" color="grey">
              of {vehicleLimits.max} allowed
            </Typography>
          </Box>

          <Box
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            borderRadius="md"
            padding="md"
            textAlign="center"
          >
            <Typography variant="h2" color="secondary" weight="bold">
              {Math.round(
                ((vehicleLimits.max - vehicleLimits.current) /
                  vehicleLimits.max) *
                  100
              )}
              %
            </Typography>
            <Typography color="secondary">Capacity Available</Typography>
            <Typography variant="body2" color="grey">
              {vehicleLimits.max - vehicleLimits.current} slots remaining
            </Typography>
          </Box>

          <Box
            bg="purple.50"
            border="1px solid"
            borderColor="purple.200"
            borderRadius="md"
            padding="md"
            textAlign="center"
          >
            <Typography variant="h2" color="info" weight="bold">
              {subscription?.status === "active" ? "Active" : "Inactive"}
            </Typography>
            <Typography>Subscription Status</Typography>
            <Typography variant="body2" color="grey">
              {isInTrial ? "Trial period" : "Full subscription"}
            </Typography>
          </Box>
        </Grid>
      </Flex>
    );
  };

  const renderBillingInformation = () => {
    if (isIndividual || !subscription) return null;

    return (
      <Flex marginY="lg" direction="column" gap="md">
        <Typography variant="h3">Billing Information</Typography>
        <Box
          bg="grey.50"
          border="1px solid"
          borderColor="grey.200"
          borderRadius="md"
          padding="md"
        >
          <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="md">
            <Flex direction="column" gap="sm">
              <Flex justifyContent="space-between">
                <Typography>Billing Email:</Typography>
                <Typography weight="bold">{profile.email}</Typography>
              </Flex>
              <Flex justifyContent="space-between">
                <Typography>Customer Code:</Typography>
                <Typography>{subscription.customer_code || "N/A"}</Typography>
              </Flex>
              <Flex justifyContent="space-between">
                <Typography>Subscription Code:</Typography>
                <Typography>
                  {subscription.subscription_code || "N/A"}
                </Typography>
              </Flex>
            </Flex>

            <Flex direction="column" gap="sm">
              {!isCancelled && start_time && (
                <Flex justifyContent="space-between">
                  <Typography>Started On:</Typography>
                  <Typography weight="bold">
                    {formatDate(start_time)}
                  </Typography>
                </Flex>
              )}

              {isCancelled && cancel_time && (
                <Flex justifyContent="space-between">
                  <Typography>Cancelled On:</Typography>
                  <Typography weight="bold" color="error">
                    {formatDate(cancel_time)}
                  </Typography>
                </Flex>
              )}

              {trial_ends_at && (
                <Flex justifyContent="space-between">
                  <Typography>Trial Ends:</Typography>
                  <Typography weight="bold" color="info">
                    {formatDate(trial_ends_at)}
                  </Typography>
                </Flex>
              )}

              <Flex justifyContent="space-between">
                <Typography>Billing Frequency:</Typography>
                <Typography weight="bold">Monthly</Typography>
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
        <Typography variant="h3">Compare Plans</Typography>
        <Box marginTop="sm" overflowX="auto">
          <Box minWidth="600px">
            <Grid
              gridTemplateColumns="1fr 1fr 1fr 1fr"
              gap="xs"
              marginBottom="sm"
              padding="sm"
            >
              <Typography weight="bold">Feature</Typography>
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
                  <Typography weight="bold">
                    {plan.name.split(" (")[0]}
                  </Typography>
                  <Typography>{formatPriceToRands(plan.price)}/mo</Typography>
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
                <Typography weight="bold">Vehicle Listings</Typography>
                {plans.map((plan) => (
                  <Typography key={plan.name} align="center">
                    {plan.limit} vehicles
                  </Typography>
                ))}
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                borderTop="1px solid"
                borderColor="grey.200"
                padding="sm"
              >
                <Typography weight="bold">Featured Listings</Typography>
                {plans.map((plan) => (
                  <Typography key={plan.name} align="center">
                    {plan.featured} listing{plan.featured > 1 ? "s" : ""}
                  </Typography>
                ))}
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                bg="grey.50"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <Typography weight="bold">Logo Display</Typography>
                <Typography align="center">✓</Typography>
                <Typography align="center">✓</Typography>
                <Typography align="center">✓</Typography>
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <Typography weight="bold">Priority Placement</Typography>
                <Typography align="center">-</Typography>
                <Typography align="center">✓</Typography>
                <Typography align="center">✓</Typography>
              </Grid>

              <Grid
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                bg="grey.50"
                borderTop="1px solid"
                borderColor="grey"
                padding="sm"
              >
                <Typography weight="bold">Performance Reports</Typography>
                <Typography align="center">-</Typography>
                <Typography align="center">✓</Typography>
                <Typography align="center">✓</Typography>
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
          <Typography variant="h2">Subscription Dashboard</Typography>
          <Typography>
            Manage your subscription plans and view detailed billing
            information.
          </Typography>
        </Box>

        {/* Current Plan Status */}
        <Flex direction="column" gap="sm" paddingY="sm">
          <Typography variant="h4">
            Current Plan:{" "}
            <Typography
              as="span"
              color="primary"
              weight="bold"
              style={{ fontSize: "inherit" }}
            >
              {subscriptionPlan}
            </Typography>
          </Typography>

          {subscription && !isIndividual && (
            <>
              {isCancelled ? (
                <Typography>
                  Cancelled at:{" "}
                  <strong>{cancel_time ? formatDate(cancel_time) : ""}</strong>
                </Typography>
              ) : (
                <Typography>
                  Subscription start:{" "}
                  <strong>{start_time ? formatDate(start_time) : "TBC"}</strong>
                </Typography>
              )}
              <Typography>
                Status:{" "}
                <strong>
                  {status ? capitaliseFirstChar(status) : "Pending Start"}
                </strong>
              </Typography>
            </>
          )}
        </Flex>

        {/* Trial Information */}
        {renderTrialInfo()}

        {/* Action Buttons */}
        <Flex gap="md" wrap="wrap">
          {renderButtonState()}

          <Button onClick={() => push("/dashboard/subscriptions/view")}>
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
