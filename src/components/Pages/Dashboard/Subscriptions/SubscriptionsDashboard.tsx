import { Box, Flex } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography } from "@/src/components/ui";
import { Profile } from "@/src/types";
import { InfoFooter } from "../components";
import { formatToReadableString } from "@/src/utils";

export const SubscriptionsDashboard = ({ profile }: { profile: Profile }) => {
  if (!profile) {
    return null;
  }

  const { user_category, subscription } = profile;

  const isIndividual = user_category === "individual";

  let subscriptionPlan: string;

  if (isIndividual) {
    subscriptionPlan = "Individual Plan";
  } else if (subscription === null) {
    subscriptionPlan = "No Plan Selected";
  } else {
    subscriptionPlan = formatToReadableString(subscription);
  }

  return (
    <ResponsiveContainer>
      <Flex direction="column" padding="lg" gap="md">
        <Box>
          <Typography as="h1" variant="h2">
            Subscription
          </Typography>

          <Typography>
            Manage your subscription plans and billing information here.
          </Typography>
        </Box>

        <Typography as="p" variant="h4">
          Current Plan: <strong>{subscriptionPlan}</strong>
        </Typography>

        <InfoFooter />
      </Flex>
    </ResponsiveContainer>
  );
};
