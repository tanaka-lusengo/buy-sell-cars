export type PostHogSponsorAdClickData = [
  event: string,
  placement: string,
  sponsor: string,
];

export type PlacementChartRow = {
  company: string;
  [key: string]: string | number;
};
