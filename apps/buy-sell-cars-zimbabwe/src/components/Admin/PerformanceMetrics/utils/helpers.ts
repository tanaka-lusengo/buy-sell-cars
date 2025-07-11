import { themeColors } from "../constants";
import { PostHogSponsorAdClickData } from "../types";

export const transformSponsorClicks = (
  posthogRows: PostHogSponsorAdClickData[]
): { company: string; clicks: number }[] => {
  const counts = new Map<string, number>();

  for (const [, , sponsor] of posthogRows) {
    if (!sponsor) continue;
    counts.set(sponsor, (counts.get(sponsor) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([company, clicks]) => ({ company, clicks }))
    .sort((a, b) => b.clicks - a.clicks);
};

export const transformByPlacement = (rows: PostHogSponsorAdClickData[]) => {
  const sponsorMap = new Map<string, Record<string, number>>();

  for (const [event, placement, sponsor] of rows) {
    console.log("Processing row:", { event, placement, sponsor });
    if (!placement || !sponsor) continue;

    if (!sponsorMap.has(sponsor)) {
      sponsorMap.set(sponsor, {});
    }

    const sponsorData = sponsorMap.get(sponsor)!;
    sponsorData[placement] = (sponsorData[placement] || 0) + 1;
  }

  const result = Array.from(sponsorMap.entries()).map(
    ([company, placements]) => ({
      company,
      ...placements,
    })
  );

  return result;
};

export const createPlacementColors = (
  placements: string[]
): Record<string, string> => {
  const colorMap: Record<string, string> = {};
  placements.forEach((placement, index) => {
    colorMap[placement] = themeColors[index % themeColors.length];
  });
  return colorMap;
};
