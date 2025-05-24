"use client";

import { DashboardSidebar } from "@/src/components/Layout";
import { generateIcon } from "@/src/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
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

  return <DashboardSidebar navLinks={navLinks}>{children}</DashboardSidebar>;
}
