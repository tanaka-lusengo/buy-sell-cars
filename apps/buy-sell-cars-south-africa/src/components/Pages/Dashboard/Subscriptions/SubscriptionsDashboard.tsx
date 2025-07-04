"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, Typography, Button } from "~bsc-shared/ui";
import {
  capitaliseFirstChar,
  formatDate,
  handleClientError,
  logErrorMessage,
  StatusCode,
  toastNotifyInfo,
} from "~bsc-shared/utils";
import { managePaystackSubscription } from "@/src/server/actions/payment";
import { Profile, Subscription } from "@/src/types";
import { Box, Flex } from "@/styled-system/jsx";
import { InfoFooter } from "../components";

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
  const { subscription_name, start_time, status, cancel_time } =
    subscription || {};

  const isCancelled = cancel_time !== null;
  const isIndividual = user_category === "individual";
  const subscriptionPlanName = subscription_name || "No Plan Selected";

  const subscriptionPlan = isIndividual
    ? "Individual Plan (Free)"
    : subscriptionPlanName;

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

  return (
    <ResponsiveContainer>
      <Flex direction="column" padding="lg" gap="md">
        <Box>
          <Typography variant="h2">Subscription</Typography>

          <Typography>
            Manage your subscription plans and billing information here.
          </Typography>
        </Box>

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

        <Flex gap="md">
          {renderButtonState()}

          <Button onClick={() => push("/dashboard/subscriptions/view")}>
            See Available Plans
          </Button>
        </Flex>

        <InfoFooter />
      </Flex>
    </ResponsiveContainer>
  );
};
