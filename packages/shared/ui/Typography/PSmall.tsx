"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { pSmallRecipe } from "./Typography.recipe";

export type PSmallProps = RecipeVariantProps<typeof pSmallRecipe> &
  React.HTMLAttributes<HTMLParagraphElement>;

export const PSmall = (props: PSmallProps) => {
  const [variantProps, localProps] = pSmallRecipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <p
      className={cx(pSmallRecipe(variantProps), className)}
      {...restProps}
    />
  );
};