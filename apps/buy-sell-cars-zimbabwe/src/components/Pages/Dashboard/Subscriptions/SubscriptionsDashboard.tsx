"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  Typography,
  Button,
  H2,
  H3,
  H4,
  P,
  PSmall,
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

  const subscriptionPlan = isIndividual
    ? "Individual Plan (Free)"
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
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
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
              {subscription?.status === "active" ? "Active" : "Inactive"}
            </H2>
            <P color="primaryDark">Subscription Status</P>
            <PSmall color="grey">Full subscription</PSmall>
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
                    <Typography weight="bold" variant="h4">
                      {plan.name.split(" (")[0]}
                    </Typography>
                    <Typography weight="bold" variant="h4">
                      {formatPriceToDollars(plan.price)}/mo
                    </Typography>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <Typography>Vehicle Listings:</Typography>
                    <Typography weight="bold">{plan.limit} vehicles</Typography>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <Typography>Featured Listings:</Typography>
                    <Typography weight="bold">
                      {plan.featured} listing{plan.featured > 1 ? "s" : ""}
                    </Typography>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <Typography>Logo Display:</Typography>
                    <Typography weight="bold">✓</Typography>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <Typography>Priority Placement:</Typography>
                    <Typography weight="bold">
                      {plan.name.includes("Starter") ? "-" : "✓"}
                    </Typography>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <Typography>Performance Analytics:</Typography>
                    <Typography weight="bold">
                      {plan.name.includes("Starter") ? "-" : "✓"}
                    </Typography>
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
                  <Typography>{formatPriceToDollars(plan.price)}/mo</Typography>
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
                <Typography weight="bold">Performance Analytics</Typography>
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
