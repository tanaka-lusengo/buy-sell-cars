import { cva } from "@/styled-system/css";

export const linkButtonRecipe = cva({
  base: {
    appearance: "none",
    background: "transparent",
    borderBottom: "2px solid",
    borderColor: "transparent",
    color: "text",
    cursor: "pointer",
    display: "inline",
    fontFamily: "body",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    margin: "0",
    padding: "0",
    textAlign: "left",
    textDecoration: "none",
    transition: "all 0.3s ease-in-out",

    _hover: {
      borderColor: "primary",
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "body2",
      },
      md: {
        fontSize: "body1",
      },
      lg: {
        fontSize: "h4",
      },
    },
    color: {
      primary: {
        color: "primary",
      },
      secondary: {
        color: "secondary",
      },
      error: {
        color: "error",
      },
      success: {
        color: "success",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
