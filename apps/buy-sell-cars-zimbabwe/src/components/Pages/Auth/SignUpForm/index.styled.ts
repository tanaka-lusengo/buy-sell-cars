import { styled } from "@/styled-system/jsx";

export const Form = styled("form", {
  base: {
    marginX: "auto",
    marginY: { base: "sm", sm: "md" },
    display: "flex",
    flexDirection: "column",
    gap: "sm",
    width: "100%",
    maxWidth: { base: "100%", sm: "45rem", lg: "50rem" },
    maxHeight: { base: "calc(100vh - 2rem)", sm: "calc(100vh - 4rem)" },
    overflowY: "auto",
    border: "2px solid transparent",
    padding: { base: "md", sm: "lg" },
    borderRadius: "1.2rem",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
});
