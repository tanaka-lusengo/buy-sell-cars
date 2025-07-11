import { tokens } from "~bsc-shared/styles";
import { TimeFrame } from "@/src/lib/posthog/endpoints";

export const timeFrames: { label: string; value: TimeFrame }[] = [
  { label: "Last 7 Days", value: "7 days" },
  { label: "Last 30 Days", value: "30 days" },
  { label: "Last 3 Months", value: "90 days" },
  { label: "1 Year Period", value: "1 year" },
];

export const themeColors = [
  tokens.colors.primary.value,
  tokens.colors.secondary.value,
  tokens.colors.primaryDark.value,
  tokens.colors.success.value,
  tokens.colors.warning.value,
  tokens.colors.error.value,
  tokens.colors.greyDark.value,
  tokens.colors.primaryLight.value,
];

export const BAR_HEIGHT = 70;
export const MIN_HEIGHT = 200;
export const MAX_HEIGHT = 600;
