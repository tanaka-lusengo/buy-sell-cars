import { TimeFrame } from "./types";

export const timeFrames: { label: string; value: TimeFrame }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "1 Year Period", value: "365d" },
  { label: "All Time views", value: "all" },
];
