"use client";

import { JSX, useState } from "react";
import { Typography, Button } from "~bsc-shared/ui";
import { handleClientError, logErrorMessage } from "~bsc-shared/utils";
import { Profile, Subscription } from "@/src/types";
import { formatPriceToRands } from "@/src/utils";
import { Box, Container, Flex } from "@/styled-system/jsx";

type SubscriptionCardProps = {
  profile: Profile;
  subscription: Subscription | null;
  planLink: string;
  planName: string;
  price: number;
  description: string;
  features: JSX.Element[];
};

export const SubscriptionCard = ({
  profile,
  subscription,
  planLink,
  planName,
  price,
  description,
  features,
}: SubscriptionCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
        `You are about to subscribe to the ${planName} plan for ${formatPriceToRands(price)}/month. Do you want to proceed?`
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
        handleSubscribe();
      }}
    >
      <Box
        border="1px solid"
        borderColor="greyLight"
        maxWidth="48rem"
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
            {formatPriceToRands(price)}/month
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
          <Flex direction="column" gap="sm">
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
