"use client";

import Link, { LinkProps } from "next/link";
import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { buttonAsLinkRecipe } from "./ButtonAsLink.recipe";

export type ButtonAsLinkProps = RecipeVariantProps<typeof buttonAsLinkRecipe> &
  Omit<LinkProps, "href"> & {
    href?: string;
    onClick: () => void;
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLAnchorElement>;

export const ButtonAsLink = (props: ButtonAsLinkProps) => {
  // `splitVariantProps` is a utility function that separates the recipe variant props from the rest of the props
  const [variantProps, localProps] =
    buttonAsLinkRecipe.splitVariantProps(props);

  const { className, children, onClick, href, ...restProps } = localProps;

  return (
    <Link
      href={href || "#"}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cx(buttonAsLinkRecipe(variantProps), className)}
      {...restProps}
    >
      {children}
    </Link>
  );
};
