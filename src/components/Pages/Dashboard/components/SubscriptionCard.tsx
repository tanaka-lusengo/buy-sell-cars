import { Typography, Button } from "@/src/components/ui";
import { Box, Flex } from "@/styled-system/jsx";
import React, { JSX } from "react";

type SubscriptionCardProps = {
  planName: string;
  price: number;
  description: string;
  features: JSX.Element[];
};

export const SubscriptionCard = ({
  planName,
  price,
  description,
  features,
}: SubscriptionCardProps) => {
  return (
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
      height="fit-content"
    >
      <Typography align="center" variant="h3">
        {planName} —{" "}
        <Typography as="span" variant="h3" color="primaryDark">
          ${price}/month
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
        <Button>Get Started</Button>
      </Box>
    </Box>
  );
};
