import { Typography } from "~bsc-shared/ui";
import { css } from "@/styled-system/css";

export const FaqData = {
  paymentRefundCancellationPolicy: {
    title: "Payment, Refund & Cancellation Policy",
    content: (
      <>
        <Typography variant="h4" weight="bold">
          1. Subscription & Billing Terms (Dealership Packages Only)
        </Typography>
        <ul className={css({ paddingLeft: "1.5rem" })}>
          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            All dealer vehicle listing packages operate on a monthly
            subscription basis, billed in advance in South African Rand (ZAR).
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Subscriptions are managed and processed securely through Paystack,
            and will auto-renew monthly on the date of the original purchase
            unless cancelled.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            By subscribing, you authorise BuySellCars South Africa to charge
            your selected payment method on a recurring monthly basis.
          </Typography>
        </ul>
        <Typography variant="body2">
          Note: Private individuals listing a single vehicle may do so for free.
          This policy applies exclusively to dealerships and businesses using
          our paid listing packages.
        </Typography>

        <Typography variant="h4" weight="bold">
          2. Cancellation Policy
        </Typography>
        <ul className={css({ paddingLeft: "1.5rem" })}>
          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            You may cancel your subscription at any time directly from your
            BuySellCars dashboard — no email notice is required.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Cancellations take effect at the end of your current billing period.
            You will not be billed for the next cycle after cancellation.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Access to paid features and listings will remain active until the
            subscription expiry date.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            It is your responsibility to ensure cancellations are made in time.
            We do not offer refunds for late cancellations or unused time.
          </Typography>
        </ul>

        <Typography variant="h4" weight="bold">
          3. Strict No-Refund Policy
        </Typography>
        <Typography>
          Due to the nature of digital advertising services, all payments are
          final and non-refundable, including but not limited to:
        </Typography>
        <ul className={css({ paddingLeft: "1.5rem" })}>
          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Late cancellations or user error in cancelling
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Partial use or non-use of services during an active subscription
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Dissatisfaction with leads, traffic, or results (we guarantee
            exposure, not performance)
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Accidental or duplicate purchases
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Early cancellation initiated by the dealership
          </Typography>
        </ul>

        <Typography variant="h4" weight="bold">
          4. Subscription Changes
        </Typography>
        <ul className={css({ paddingLeft: "1.5rem" })}>
          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            You may upgrade or downgrade your dealership subscription at any
            time directly from your dashboard. It is your responsibility to
            ensure you cancel your existing subscription before subscribing to a
            new one.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Any changes made will be applied in the next billing cycle, and the
            updated subscription fee will be automatically charged at that time.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            You will continue to receive the benefits of your current plan until
            the new plan takes effect.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            BuySellCars South Africa reserves the right to increase or decrease
            package pricing at any time. Any pricing adjustments will only take
            effect from your next renewal date — you will be notified in
            advance.
          </Typography>
        </ul>

        <Typography variant="h4" weight="bold">
          5. Failed Payments & Account Suspension
        </Typography>
        <ul className={css({ paddingLeft: "1.5rem" })}>
          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            If Paystack is unable to process your payment, your subscription
            will enter a grace period before your account is placed on hold.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Listings will be temporarily removed until payment is resolved.
          </Typography>

          <Typography
            as="li"
            style={{
              listStyleType: "disc",
            }}
          >
            Repeated failed payments may result in account deactivation.
          </Typography>
        </ul>

        <Typography variant="h4" weight="bold">
          6. Billing Queries
        </Typography>

        <Typography>
          All billing-related queries must be submitted within 3 business days
          of the transaction. After this period, we may not be able to
          investigate or reverse charges.
        </Typography>
      </>
    ),
  },
};
