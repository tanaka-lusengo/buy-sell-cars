"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { pRecipe } from "./Typography.recipe";

export type PProps = RecipeVariantProps<typeof pRecipe> &
  React.HTMLAttributes<HTMLParagraphElement>;

export const P = (props: PProps) => {
  const [variantProps, localProps] = pRecipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <p
      className={cx(pRecipe(variantProps), className)}
      {...restProps}
    />
  );
};