import { styled } from "@/styled-system/jsx";

export const Form = styled("form", {
  base: {
    marginX: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "md",
    width: "100%",
    maxWidth: "80rem",
    border: "2px solid transparent",
    paddingY: "lg",
    backgroundColor: "transparent",
  },
});

export const ListingsForm = styled(Form, {
  base: {
    minWidth: "230rem",
    overflowX: "auto",
    paddingY: "sm",
  },
});

export const SecurityForm = styled(Form, {
  base: {
    marginY: "lg",
    marginX: "sm",
    maxWidth: "50rem",
    paddingX: "md",
    borderRadius: "1.2rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    _hover: {
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    },
    transition: "all 0.3s ease-in-out",
  },
});
