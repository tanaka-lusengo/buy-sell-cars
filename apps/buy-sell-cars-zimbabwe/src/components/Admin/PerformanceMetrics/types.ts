export type PostHogSponsorAdClickData = [
  event: string,
  placement: string,
  sponsor: string,
];

export type PlacementChartRow = {
  company: string;
  [key: string]: string | number;
};

export type ChartData = {
  company: string;
  clicks: number;
};

export type ChartConfig = {
  height: number;
  maxValue: number;
  ticks: number[];
};

export type ResponsiveState = {
  isMobile: boolean;
};
