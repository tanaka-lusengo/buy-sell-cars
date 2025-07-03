"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Typography, Button } from "~bsc-shared/ui";
import { handleClientError, StatusCode } from "~bsc-shared/utils";
import { SuspenseLoader } from "@/src/components/shared";
import { verifySubscriptionReference } from "@/src/server/actions/payment";
import { Box, Grid, Flex, VStack } from "@/styled-system/jsx";

const SuccessPaymentPage = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlanName, setSubscriptionPlanName] = useState("");

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!reference) {
        console.error("Reference is missing");
        return;
      }

      try {
        const { data, status, error } =
          await verifySubscriptionReference(reference);

        if (status !== StatusCode.SUCCESS || error || !data) {
          return handleClientError(
            "verifying Paystack subscription - failed",
            error
          );
        }

        // Set the subscription plan name based on the retrieved data
        // The webhook will handle the actual logging to the database
        setSubscriptionPlanName(data.plan_name || "");
      } catch (error) {
        handleClientError(
          "An unexpected error occurred while verifying subscription",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [reference]);

  return (
    <Box position="relative" height="100vh" overflow="hidden">
      <Image
        src="/images/car-headlight.png"
        alt="Red car headlight"
        fill
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        priority
        quality={70}
      />

      {isLoading ? (
        <SuspenseLoader />
      ) : (
        <Grid gridTemplateColumns={{ base: "1fr", sm: "100%" }} height="100%">
          <VStack
            height="100vh"
            overflowY="auto"
            paddingTop="xl"
            paddingBottom="lg"
            paddingX="md"
            zIndex={1}
          >
            <Flex
              direction="column"
              marginX="auto"
              marginBottom="xl"
              maxWidth="600px"
              width="100%"
              gap="md"
            >
              <Typography variant="h2" align="center" color="white">
                Your payment was successful!
              </Typography>

              <Typography variant="h4" align="center" color="white">
                Thank you for subscribing to the{" "}
                <Typography
                  as="span"
                  weight="bold"
                  color="primary"
                  style={{ fontSize: "inherit" }}
                >
                  {subscriptionPlanName}
                </Typography>{" "}
                plan! You can now access your dashboard and start managing your
                dealership effectively.
              </Typography>
            </Flex>

            <Button
              onClick={() => push("/dashboard/subscriptions")}
              color="white"
            >
              Go to Subscription
            </Button>
          </VStack>
        </Grid>
      )}
    </Box>
  );
};

export default SuccessPaymentPage;
