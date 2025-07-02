"use client";

import { JSX, useState } from "react";
import { Typography, Button } from "~bsc-shared/ui";
import { handleClientError, logErrorMessage } from "~bsc-shared/utils";
import { formatPriceToRands } from "@/src/utils";
import { Box, Flex } from "@/styled-system/jsx";

type SubscriptionCardProps = {
  planLink: string;
  planName: string;
  price: number;
  description: string;
  features: JSX.Element[];
};

export const SubscriptionCard = ({
  planLink,
  planName,
  price,
  description,
  features,
}: SubscriptionCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      window.open(planLink, "_blank", "noopener,noreferrer");
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
          {planName} —{" "}
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

        <Box marginX="auto" marginY="md" textAlign="center">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Redirecting..." : "Get Started"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};
