import { SUBSCRIPTIONS } from "@/src/constants/subscription";

export const starterShowcasePlan = {
  name: SUBSCRIPTIONS.StarterShowcase.name,
  planLink: SUBSCRIPTIONS.StarterShowcase.planLink,
  price: SUBSCRIPTIONS.StarterShowcase.price,
  basePrice: SUBSCRIPTIONS.StarterShowcase.basePrice,
  vat: SUBSCRIPTIONS.StarterShowcase.vat,
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
  planLink: SUBSCRIPTIONS.GrowthAccelerator.planLink,
  price: SUBSCRIPTIONS.GrowthAccelerator.price,
  basePrice: SUBSCRIPTIONS.GrowthAccelerator.basePrice,
  vat: SUBSCRIPTIONS.GrowthAccelerator.vat,
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
  planLink: SUBSCRIPTIONS.DealershipDominator.planLink,
  price: SUBSCRIPTIONS.DealershipDominator.price,
  basePrice: SUBSCRIPTIONS.DealershipDominator.basePrice,
  vat: SUBSCRIPTIONS.DealershipDominator.vat,
  description: "Maximum visibility for high-volume dealerships.",
  features: [
    <>
      <b>List up to 100 vehicles</b> (negotiable for larger)
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
      <b>Brand ambassador</b> utilisation for dealership
    </>,
    <>
      <b>Instagram</b> and social media cross-collaboration
    </>,
    <>
      <b>Videographer</b>
    </>,
  ],
};
