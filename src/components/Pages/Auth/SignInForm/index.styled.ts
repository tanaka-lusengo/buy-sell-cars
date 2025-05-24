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
    transition: "box-shadow 0.3s ease-in-out",

    "&:hover": {
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    },
  },
});
