import { styled } from "@/styled-system/jsx";

export const Form = styled("form", {
  base: {
    marginX: "auto",
    marginY: "lg",
    display: "flex",
    flexDirection: "column",
    gap: "sm",
    width: "100%",
    maxWidth: "55rem",
    border: "2px solid transparent",
    padding: "lg",
    borderRadius: "1.2rem",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
});
