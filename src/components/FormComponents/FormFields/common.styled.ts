import { styled } from "@/styled-system/jsx";

export const ErrorText = styled("p", {
  base: {
    color: "error",
  },
});

export const InputContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xs",
    width: "100%",
    marginX: "auto",
  },
});

export const Label = styled("label", {
  base: {
    fontSize: "body1",
  },
});

export const InputField = styled("input", {
  base: {
    cursor: "text",
    width: "100%",
    padding: "sm",
    border: "2px solid",
    borderColor: "grey",
    borderRadius: "1.2rem",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "border-color 0.2s ease-in-out",
    _focusVisible: {
      outline: "none",
      borderColor: "primary",
    },
  },
});

export const FileInputField = styled("input", {
  base: {
    display: "none",
  },
});

export const SelectField = styled("select", {
  base: {
    cursor: "pointer",
    width: "100%",
    padding: "sm",
    height: "4.7rem",
    border: "2px solid",
    borderColor: "grey",
    borderRadius: "1.2rem",
    whiteSpace: "nowrap",
    _focusVisible: {
      outline: "none",
      borderColor: "primary",
    },
  },
});

export const TextareaField = styled("textarea", {
  base: {
    minHeight: "4.7rem",
    width: "100%",
    padding: "sm",
    border: "2px solid",
    borderColor: "grey",
    borderRadius: "1.2rem",
    whiteSpace: "wrap",
    _focusVisible: {
      outline: "none",
      borderColor: "primary",
    },
  },
});
