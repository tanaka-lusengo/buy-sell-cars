"use client";

import type { RecipeVariantProps } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import type { HTMLStyledProps } from "@/styled-system/jsx";
import { ResponsiveContainerRecipe } from "./ResponsiveContainer.recipe";

export type ResponsiveContainerProps = {
  children: React.ReactNode;
} & RecipeVariantProps<typeof ResponsiveContainerRecipe> &
  HTMLStyledProps<"section">;

export const ResponsiveContainer = ({
  children,
  className,
  ...props
}: ResponsiveContainerProps) => {
  const Component = styled("section", ResponsiveContainerRecipe);

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};
