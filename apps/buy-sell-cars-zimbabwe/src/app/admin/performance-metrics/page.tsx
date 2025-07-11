import { type Metadata } from "next";
import { PerformanceMetrics } from "@/src/components/Admin";

export const metadata: Metadata = {
  title: "Admin | Performance Metrics",
  description: "View your customer's and sponsor's performance metrics.",
};

const PerformanceMetricsPage = async () => {
  return <PerformanceMetrics />;
};

export default PerformanceMetricsPage;
