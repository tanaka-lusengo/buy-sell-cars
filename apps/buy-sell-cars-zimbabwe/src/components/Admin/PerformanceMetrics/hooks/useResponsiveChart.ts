import { useWindowSize } from "~bsc-shared/hooks";
import { breakpointsNumber } from "@/src/styles";

export const useResponsiveChart = () => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  return { isMobile };
};
