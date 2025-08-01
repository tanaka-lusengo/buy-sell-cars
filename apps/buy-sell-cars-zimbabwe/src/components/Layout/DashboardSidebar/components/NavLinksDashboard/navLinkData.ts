import { generateIcon } from "~bsc-shared/utils";

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
  {
    href: "/dashboard/performance/",
    icon: generateIcon("chart-line"),
    label: "Performance",
  },
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
