import { cva } from "@/styled-system/css";

const baseStyles = {
  color: "text",
};

const commonVariants = {
  weight: {
    normal: { fontWeight: "normal" },
    medium: { fontWeight: "medium" },
    semibold: { fontWeight: "semibold" },
    bold: { fontWeight: "bold" },
  },
  italic: {
    true: { fontStyle: "italic" },
  },
  align: {
    left: { textAlign: "left" },
    center: { textAlign: "center" },
    right: { textAlign: "right" },
  },
  font: {
    body: { fontFamily: "body" },
    heading: { fontFamily: "heading" },
  },
  color: {
    primary: { color: "primary" },
    primaryDark: { color: "primaryDark" },
    primaryLight: { color: "primaryLight" },
    secondary: { color: "secondary" },
    grey: { color: "grey" },
    success: { color: "success" },
    error: { color: "error" },
    warning: { color: "warning" },
    info: { color: "info" },
    text: { color: "text" },
    textLight: { color: "textLight" },
    white: { color: "white" },
    green: { color: "green" },
  },
  underline: {
    true: { textDecoration: "underline" },
  },
  hoverEffect: {
    color: {
      _hover: {
        transition: "all 0.2s ease-in-out",
        color: "primaryDark",
      },
    },
    colorWhatsapp: {
      _hover: {
        transition: "all 0.2s ease-in-out",
        color: "green",
      },
    },
    opacity: {
      _hover: {
        transition: "all 0.2s ease-in-out",
        opacity: 0.8,
      },
    },
    size: {
      _hover: {
        transition: "all 0.2s ease-in-out",
        transform: "scale(1.05)",
      },
    },
  },
};

const commonDefaults = {
  weight: "normal",
  align: "left",
  font: "body",
} as const;

export const h1Recipe = cva({
  base: { ...baseStyles, textStyle: "h1" },
  variants: commonVariants,
  defaultVariants: { ...commonDefaults },
});

export const h2Recipe = cva({
  base: { ...baseStyles, textStyle: "h2" },
  variants: commonVariants,
  defaultVariants: { ...commonDefaults },
});

export const h3Recipe = cva({
  base: { ...baseStyles, textStyle: "h3" },
  variants: commonVariants,
  defaultVariants: { ...commonDefaults },
});

export const h4Recipe = cva({
  base: { ...baseStyles, textStyle: "h4" },
  variants: commonVariants,
  defaultVariants: { ...commonDefaults },
});

export const h5Recipe = cva({
  base: { ...baseStyles, textStyle: "h5" },
  variants: commonVariants,
  defaultVariants: { ...commonDefaults },
});

export const h6Recipe = cva({
  base: { ...baseStyles, textStyle: "h6" },
  variants: commonVariants,
  defaultVariants: { ...commonDefaults },
});

export const pRecipe = cva({
  base: { ...baseStyles, textStyle: "body1" },
  variants: commonVariants,
  defaultVariants: commonDefaults,
});

export const pSmallRecipe = cva({
  base: { ...baseStyles, textStyle: "body2" },
  variants: commonVariants,
  defaultVariants: commonDefaults,
});

export const spanRecipe = cva({
  base: { ...baseStyles, textStyle: "body1" },
  variants: commonVariants,
  defaultVariants: commonDefaults,
});

// Keep the original recipe for backward compatibility
export const typographyRecipe = cva({
  base: baseStyles,
  variants: {
    variant: {
      h1: { textStyle: "h1" },
      h2: { textStyle: "h2" },
      h3: { textStyle: "h3" },
      h4: { textStyle: "h4" },
      h5: { textStyle: "h5" },
      h6: { textStyle: "h6" },
      body1: { textStyle: "body1" },
      body2: { textStyle: "body2" },
    },
    ...commonVariants,
  },
  defaultVariants: {
    variant: "body1",
    ...commonDefaults,
  },
});
