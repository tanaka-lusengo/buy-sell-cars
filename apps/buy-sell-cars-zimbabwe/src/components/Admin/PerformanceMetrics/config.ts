export const CHART_CONFIG = {
  colors: {
    primary: "#d6bd83",
    fallback: "#999",
  },
  dimensions: {
    barHeight: 70,
    minHeight: 200,
    maxHeight: 600,
  },
  styling: {
    borderRadius: {
      container: "1.2rem",
      barTop: [12, 12, 0, 0] as [number, number, number, number],
      barSide: [0, 12, 12, 0] as [number, number, number, number],
    },
    shadows: {
      default: "0 2px 8px rgba(0, 0, 0, 0.1)",
      hover: "0 4px 16px rgba(0, 0, 0, 0.2)",
    },
    transition: "0.3s ease-in-out",
  },
} as const;
