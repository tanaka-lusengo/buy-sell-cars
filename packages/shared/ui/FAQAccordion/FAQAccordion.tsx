"use client";

import { useState } from "react";
import { css } from "../../styled-system/css";
import { Flex, Box } from "../../styled-system/jsx";
import { generateIcon } from "../../utils";
import { Span } from "../Typography";

type FAQAccordionProps = {
  title: string;
  content: React.ReactNode;
};

export const FAQAccordion = ({ title, content }: FAQAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const buttonStyles = css({
    width: "100%",
    paddingY: "md",
    paddingX: "lg",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "medium",
    fontSize: "md",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 0.3s ease",
    _hover: { bg: "greyLight" },
    _focus: {
      outline: "2px solid",
      outlineColor: "secondary",
      outlineOffset: "2px",
      backgroundColor: "greyLight",
    },
  });

  return (
    <Box
      borderWidth="1px"
      borderColor="grey"
      borderRadius="1.2rem"
      overflow="hidden"
      bg="white"
      shadow="md"
    >
      <button onClick={toggleAccordion} className={buttonStyles}>
        <Span weight="bold">{title}</Span>
        <Box
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.3s ease"
          fontSize="lg"
        >
          {generateIcon("chevron-down")}
        </Box>
      </button>

      <Box
        overflow="hidden"
        transition="all 0.3s ease"
        maxHeight={isOpen ? "1500px" : "0"}
        opacity={isOpen ? 1 : 0}
      >
        <Box
          paddingY="md"
          paddingX="lg"
          borderTopColor="secondary"
          borderTopWidth="1px"
        >
          <Flex direction="column" gap="md" minHeight="fit-content">
            {content}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
