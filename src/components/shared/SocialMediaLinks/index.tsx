import Link from "next/link";
import { Typography } from "@/src/components/ui";
import { VStack } from "@/styled-system/jsx";

type SocialMediaLinkProps = {
  label?: string;
  size?: "xs" | "sm" | "lg" | "xl";
  href: string;
  type: "instagram" | "square-facebook" | "whatsapp";
};

export const SocialMediaLink = ({
  label,
  size = "xl",
  href,
  type,
}: SocialMediaLinkProps) => {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <VStack _hover={{ color: "primary", transition: "0.3s ease-in-out" }}>
        <i
          className={`fa-brands fa-${type} fa-${size}`}
          aria-hidden="true"
          title={label || type}
        ></i>
        {label && <Typography>{label}</Typography>}
      </VStack>
    </Link>
  );
};
