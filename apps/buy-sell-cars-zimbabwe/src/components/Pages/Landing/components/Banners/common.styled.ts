import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";

export const BannerContainer = styled("div", {
  base: {
    marginX: "auto",
    width: "100%",
    height: "100%",
    px: "md",
    maxWidth: { sm: "pageSm", md: "pageMd", lg: "pageLg", xl: "pageXl" },
    backgroundColor: "transparent",
  },
});

export const fadeSlide = css({
  opacity: 0,
  transition: "opacity 0.6s ease-in-out",
});
