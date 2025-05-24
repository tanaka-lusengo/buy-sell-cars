import { generateIcon } from "@/src/utils";

export const navLinksDashboard = [
  { href: "/dashboard/", icon: generateIcon("user"), label: "Profile" },
  {
    href: "/dashboard/add-listing/",
    icon: generateIcon("plus"),
    label: "Add Listing",
  },
  {
    href: "/dashboard/listings/",
    icon: generateIcon("car-side"),
    label: "Your Listings",
  },
  //   TODO: Uncomment when performance page is ready
  // {
  //   href: "/dashboard/performance/",
  //   icon: generateIcon("chart-line"),
  //   label: "Performance",
  // },
  {
    href: "/dashboard/security/",
    icon: generateIcon("lock"),
    label: "Security",
  },
  {
    href: "/dashboard/subscriptions/",
    icon: generateIcon("wallet"),
    label: "Subscriptions",
  },
];
