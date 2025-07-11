import { generateIcon } from "~bsc-shared/utils";

export const navLinksDashboard = [
  {
    label: "User Management",
  },
  {
    href: "/admin/user-listings/dealership/",
    icon: generateIcon("users"),
    label: "Dealerships",
  },
  {
    href: "/admin/user-listings/individual/",
    icon: generateIcon("user"),
    label: "Individuals",
  },
  {
    label: "Vehicle Listings",
  },
  {
    href: "/admin/vehicle-listings/",
    icon: generateIcon("car"),
    label: "All Vehicles",
  },
  {
    label: "Performance Metrics",
  },
  {
    href: "/admin/performance-metrics/",
    icon: generateIcon("chart-bar"),
    label: "Sponsor Ad Clicks",
  },
];
