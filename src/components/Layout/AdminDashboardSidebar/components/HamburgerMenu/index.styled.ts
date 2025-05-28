import { styled } from "@/styled-system/jsx";

// Button styles
export const Button = styled("button", {
  base: {
    display: { lg: "flex", xxl: "none" },
    color: "primary",
    cursor: "pointer",
    padding: "0.5rem",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 65,
    _focus: {
      borderColor: "primary",
    },
    _focusVisible: {
      outline: "none",
      borderColor: "primary",
    },
  },
});

export const BarWrapper = styled("div", {
  base: {
    position: "relative",
    padding: "md",
  },
});

export const Bar = styled("span", {
  base: {
    display: "block",
    position: "absolute",
    left: 0,
    height: "2px",
    width: "100%",
    backgroundColor: "primary",
    borderRadius: "9px",
    transition: "all 0.3s ease-in-out",
  },
  variants: {
    position: {
      top: {},
      middle: {},
      bottom: {},
    },
    isOpen: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      position: "top",
      isOpen: true,
      css: {
        transform: "rotate(45deg)",
      },
    },
    {
      position: "top",
      isOpen: false,
      css: {
        transform: "translateY(-8px)",
      },
    },
    {
      position: "middle",
      isOpen: true,
      css: {
        opacity: 0,
      },
    },
    {
      position: "middle",
      isOpen: false,
      css: {
        opacity: 1,
      },
    },
    {
      position: "bottom",
      isOpen: true,
      css: {
        transform: "rotate(-45deg)",
      },
    },
    {
      position: "bottom",
      isOpen: false,
      css: {
        transform: "translateY(8px)",
      },
    },
  ],
});

// Navigation styles
export const NavList = styled("ul", {
  base: {
    marginTop: "md",
    display: { base: "flex", xl: "none" },
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "2rem",
  },
});

export const NavDrawer = styled("div", {
  base: {
    display: { base: "block", xxl: "none" },
    position: "fixed",
    top: 30,
    right: 0,
    bottom: 0,
    width: "100%",
    maxWidth: { base: "100vw", sm: "30rem" },
    backgroundColor: "white",
    transition: "all 0.3s ease-in-out",
    px: "lg",
    pt: "xl",
    pb: "lg",
    overflowY: "auto",
    zIndex: 40,
  },
  variants: {
    isOpen: {
      true: { transform: "translateX(0)" },
      false: { transform: "translateX(100%)" },
    },
  },
});

export const Overlay = styled("div", {
  base: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: "all 0.3s ease-in-out",
    backgroundColor: "black",
    opacity: 0.7,
    display: { base: "block" },
    zIndex: 25,
  },
});
