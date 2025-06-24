"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Typography } from "~bsc-shared/ui";
import { InfoFooter } from "@/src/components/Pages/Dashboard/components";
import { Box, Flex, Grid, VStack } from "@/styled-system/jsx";

const PaymentCancelPage = () => {
  const { push } = useRouter();

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
              Payment Cancelled
            </Typography>

            <Typography variant="h4" align="center" color="white">
              It seems like you have cancelled the payment process. If you need
              assistance or want to try again, please contact our support team.
            </Typography>
          </Flex>

          <Flex justifyContent="center" alignItems="center" gap="md">
            <Button onClick={() => push("/")} color="white">
              Go back to Home
            </Button>
            <Typography>Or</Typography>
            <Button onClick={() => push("/dashboard")} color="white">
              Try again
            </Button>
          </Flex>

          <InfoFooter color="white" />
        </VStack>
      </Grid>
    </Box>
  );
};

export default PaymentCancelPage;
