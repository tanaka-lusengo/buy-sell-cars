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
