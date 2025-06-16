import { styled } from "@/styled-system/jsx";
import Link from "next/link";

export const FooterContainer = styled("footer", {
  base: {
    display: "flex",
    flexDirection: "column",
    paddingY: "lg",
    borderTop: "1px solid",
    borderColor: "greyLight",
  },
});

export const FooterContent = styled("div", {
  base: {
    marginX: "auto",
    width: "100%",
    height: "100%",
    px: "md",
    maxWidth: { sm: "pageSm", md: "pageMd", lg: "pageLg", xl: "pageXl" },
  },
});

export const FooterLink = styled(Link, {
  base: {
    display: "inline-flex",
    fontSize: "body2",
    transition: "color 0.3s ease-in-out",

    "&:hover": {
      color: "primaryDark",
    },
  },
});
