import { styled } from "@/styled-system/jsx";

export const Header = styled("header", {
  base: {
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor: "white",
    paddingY: "1rem",
  },
});

export const Nav = styled("nav", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginX: "auto",
  },
});

export const NavList = styled("ul", {
  base: {
    display: { base: "none", lg: "flex" },
    gap: "2rem",
  },
});

export const SubNavList = styled("ul", {
  base: {
    display: { base: "none", lg: "flex" },
    gap: "md",
    flexDirection: "row",
    alignItems: "center",
  },
});
