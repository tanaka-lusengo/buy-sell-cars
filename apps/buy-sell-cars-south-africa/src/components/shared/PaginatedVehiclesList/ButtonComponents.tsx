import { css } from "@/styled-system/css";

type ButtonProps = {
  isDisabled: boolean;
  onClick: () => void;
};

const buttonClass = (isDisabled: boolean) =>
  css({
    transition: "all 0.3s ease-in-out",
    color: isDisabled ? "grey" : "primaryDark",
    cursor: isDisabled ? "default" : "pointer",
    _hover: !isDisabled
      ? {
          color: "primary",
          transform: "scale(1.1)",
        }
      : {},
    pointerEvents: isDisabled ? "none" : "auto",
  });

export const PrevButton = ({ isDisabled, onClick }: ButtonProps) => (
  <i
    className={`fa-solid fa-arrow-left fa-xl ${buttonClass(isDisabled)}`}
    aria-hidden="true"
    title="Arrow Left"
    role="button"
    onClick={onClick}
  ></i>
);

export const NextButton = ({ isDisabled, onClick }: ButtonProps) => (
  <i
    className={`fa-solid fa-arrow-right fa-xl ${buttonClass(isDisabled)}`}
    aria-hidden="true"
    title="Arrow Right"
    role="button"
    onClick={onClick}
  ></i>
);
