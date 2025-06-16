import { defineTokens, defineTextStyles } from "@pandacss/dev";

export const tokens = defineTokens({
  fonts: {
    heading: { value: "Satoshi, sans-serif" },
    body: { value: "Erode, sans-serif" },
  },
  spacing: {
    xxs: { value: "0.2rem" },
    xs: { value: "0.4rem" },
    sm: { value: "0.8rem" },
    md: { value: "1.6rem" },
    lg: { value: "3.2rem" },
    xl: { value: "6.4rem" },
    xxl: { value: "12.8rem" },
  },
  sizes: {
    pageSm: { value: "54rem" },
    pageMd: { value: "72rem" },
    pageLg: { value: "96rem" },
    pageXl: { value: "144rem" },
  },
  fontSizes: {
    body1: { value: "1.8rem" },
    body2: { value: "1.6rem" },
    h1: { value: "4rem" },
    h2: { value: "3.6rem" },
    h3: { value: "2.8rem" },
    h4: { value: "2.2rem" },
    h5: { value: "1.8rem" },
    h6: { value: "1.6rem" },
  },
  colors: {
    primary: { value: "#d6bd83" },
    primaryLight: { value: "#e8d8b0" },
    primaryDark: { value: "#b58f4d" },
    secondary: { value: "#3a6ea5" },
    text: { value: "#1e2737" },
    textLight: { value: "#e2e8f0" },
    white: { value: "#ffffff" },
    black: { value: "#000000" },
    grey: { value: "#cccccc" },
    greyLight: { value: "#f5f5f7" },
    greyDark: { value: "#999999" },
    success: { value: "#4caf50" },
    warning: { value: "#ff9800" },
    whatsApp: { value: "#25D366" },
    error: { value: "#c75146" },
  },
});

export const textStyles = defineTextStyles({
  h1: {
    description: "Heading 1",
    value: {
      fontSize: {
        base: "h2",
        sm: "h1",
      },
      fontWeight: "bold",
      lineHeight: "1.375",
      fontFamily: "heading",
    },
  },
  h2: {
    description: "Heading 2",
    value: {
      fontSize: {
        base: "h3",
        sm: "h2",
      },
      fontWeight: "bold",
      lineHeight: "1.375",
      fontFamily: "heading",
    },
  },
  h3: {
    description: "Heading 3",
    value: {
      fontSize: {
        base: "h4",
        sm: "h3",
      },
      fontWeight: "bold",
      lineHeight: "1.4",
      fontFamily: "heading",
    },
  },
  h4: {
    description: "Heading 4",
    value: {
      fontSize: {
        base: "h5",
        sm: "h4",
      },
      fontWeight: "semibold",
      lineHeight: "1.4",
      fontFamily: "heading",
    },
  },
  h5: {
    description: "Heading 5",
    value: {
      fontSize: "h5",
      fontWeight: "semibold",
      lineHeight: "1.45",
      fontFamily: "heading",
    },
  },
  h6: {
    description: "Heading 6",
    value: {
      fontSize: "h6",
      fontWeight: "medium",
      lineHeight: "1.45",
      fontFamily: "heading",
    },
  },
  body1: {
    description: "Body text large",
    value: {
      fontSize: {
        base: "body2",
        sm: "body1",
      },
      fontWeight: "normal",
      lineHeight: "1.5",
      fontFamily: "body",
    },
  },
  body2: {
    description: "Body text small",
    value: {
      fontSize: "body2",
      fontWeight: "normal",
      lineHeight: "1.5",
      fontFamily: "body",
    },
  },
});

export const breakpoints = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1400px",
};

export const breakpointsNumber = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};
