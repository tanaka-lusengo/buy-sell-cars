"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { h2Recipe } from "./Typography.recipe";

export type H2Props = RecipeVariantProps<typeof h2Recipe> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H2 = (props: H2Props) => {
  const [variantProps, localProps] = h2Recipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <h2
      className={cx(h2Recipe(variantProps), className)}
      {...restProps}
    />
  );
};