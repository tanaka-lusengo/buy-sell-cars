"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Button } from "@/src/components/ui";
import { subscribeToPlan } from "@/src/server/actions/payment";
import { Profile } from "@/src/types";
import { handleClientError, StatusCode } from "@/src/utils";
import { Box, Flex } from "@/styled-system/jsx";

type Link = {
  href: string;
  rel: string;
  method: string;
};

type SubscriptionCardProps = {
  profile: Profile;
  planId: string;
  planName: string;
  price: number;
  description: string;
  features: JSX.Element[];
};

export const SubscriptionCard = ({
  profile,
  planId,
  planName,
  price,
  description,
  features,
}: SubscriptionCardProps) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const { data, status, error } = await subscribeToPlan(profile, planId);

      if (status !== StatusCode.SUCCESS || error || !data) {
        console.error("Subscription creation failed:", error);
        return handleClientError(
          "subscrbing to subscription plan",
          "Creation failed"
        );
      }

      const approveLink = data.links.find(
        (link: Link) => link.rel === "approve"
      );

      if (!approveLink) {
        handleClientError(
          "No approval link found in subscription response",
          null
        );
        return;
      }

      push(approveLink.href);
    } catch (error) {
      handleClientError(
        "An unexpected error occurred while subscribing to the plan",
        error
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
          <Typography as="span" variant="h3" color="primaryDark">
            ${price}/month
          </Typography>
        </Typography>

        <Typography align="center" variant="body2">
          (excl. VAT)
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
