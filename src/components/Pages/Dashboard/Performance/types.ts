export type TimeFrame = "7d" | "30d" | "90d" | "365d" | "all";

export type AdClick = {
  make: string;
  model: string;
  year: number | null;
  clickCount: number;
  vehicleId: string;
};
