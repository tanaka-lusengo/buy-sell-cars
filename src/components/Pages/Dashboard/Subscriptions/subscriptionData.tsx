import { SUBSCRIPTIONS } from "@/src/constants/values";

export const starterShowcasePlan = {
  name: SUBSCRIPTIONS.StarterShowcase.name,
  planId: SUBSCRIPTIONS.StarterShowcase.planId,
  price: SUBSCRIPTIONS.StarterShowcase.price,
  description: "Perfect entry point for new or smaller dealerships.",
  features: [
    <>
      List up to <b>25 vehicles</b> at once
    </>,
    <>
      <b>1 Featured Listing</b> (rotated weekly)
    </>,
    <>
      <b>Display your logo</b> on each listing
    </>,
    <>
      <b>Personal</b> Digital Showroom Page
    </>,
  ],
};

export const growthAcceleratorPlan = {
  name: SUBSCRIPTIONS.GrowthAccelerator.name,
  planId: SUBSCRIPTIONS.GrowthAccelerator.planId,
  price: SUBSCRIPTIONS.GrowthAccelerator.price,
  description: "Ideal for growing dealerships looking to stand out.",
  features: [
    <>
      List up to <b>75 vehicles</b> at once
    </>,
    <>
      <b>3 Featured Listing</b> (rotated weekly)
    </>,
    <>
      <b>Priority Listing Placement on homepage</b>
    </>,
    <>
      Monthly <b>Performance Reports</b>
    </>,
  ],
};

export const dealershipDominatorPlan = {
  name: SUBSCRIPTIONS.DealershipDominator.name,
  planId: SUBSCRIPTIONS.DealershipDominator.planId,
  price: SUBSCRIPTIONS.DealershipDominator.price,
  description: "Maximum visibility for high-volume dealerships.",
  features: [
    <>
      <b>List up to 100 vehicles</b> (negotiable for larger needs)
    </>,
    <>
      <b>5 Featured Listings</b> (rotated weekly)
    </>,
    <>
      <b>Homepage Carousel</b> (premium placement)
    </>,
    <>
      <b>Homepage Logo Placement</b> (rotated weekly)
    </>,
    <>
      <b>CTR Links</b> to your website (if applicable)
    </>,
    <>
      <b>1 Custom Video</b> (on request)
    </>,
  ],
};
