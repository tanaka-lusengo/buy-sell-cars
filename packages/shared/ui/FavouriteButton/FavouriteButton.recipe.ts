import { cva } from "@/styled-system/css";

export const favouriteButtonRecipe = cva({
  base: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    bg: "rgba(255, 255, 255, 0.9)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    zIndex: 10,
    _hover: {
      bg: "white",
      transform: "scale(1.1)",
    },
    _focus: {
      outline: "none",
      ring: "2px",
      ringColor: "primary",
    },
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      _hover: {
        transform: "none",
      },
    },
  },
  variants: {
    isFavourite: {
      true: {
        "& .heart-icon": {
          color: "red.500",
          fill: "red.500",
        },
      },
      false: {
        "& .heart-icon": {
          color: "gray.600",
          fill: "none",
        },
      },
    },
  },
  defaultVariants: {
    isFavourite: false,
  },
});
