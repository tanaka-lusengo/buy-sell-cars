import { styled } from "@/styled-system/jsx";

export const Form = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "sm",
    height: "fit-content",
    width: "100%",
    maxWidth: "40rem",
    border: "2px solid white",
    borderRadius: "1rem",
    padding: "lg",
    backgroundColor: "white",
  },
});
