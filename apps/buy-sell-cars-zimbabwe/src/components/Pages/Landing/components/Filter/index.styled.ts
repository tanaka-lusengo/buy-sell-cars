import { styled } from "@/styled-system/jsx";

export const Form = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "sm",
    width: { base: "100%", lg: "38rem" },
    border: "1px solid",
    borderColor: "greyLight",
    borderRadius: "1rem",
    padding: "md",
    backgroundColor: "white",
  },
});
