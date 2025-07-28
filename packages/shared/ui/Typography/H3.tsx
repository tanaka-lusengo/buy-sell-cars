"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { h3Recipe } from "./Typography.recipe";

export type H3Props = RecipeVariantProps<typeof h3Recipe> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H3 = (props: H3Props) => {
  const [variantProps, localProps] = h3Recipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <h3
      className={cx(h3Recipe(variantProps), className)}
      {...restProps}
    />
  );
};