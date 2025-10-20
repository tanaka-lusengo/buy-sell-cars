import { SUBSCRIPTIONS } from "@/src/constants/subscription";

export const communityAccessPlan = {
  name: SUBSCRIPTIONS.CommunityAccess.name,
  planLink: SUBSCRIPTIONS.CommunityAccess.planLink,
  price: SUBSCRIPTIONS.CommunityAccess.price,
  basePrice: SUBSCRIPTIONS.CommunityAccess.basePrice,
  description: "Free plan for small dealerships to get started.",
  features: [
    <>
      List up to <b>20 vehicles</b> at once
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
