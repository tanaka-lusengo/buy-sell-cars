"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { h6Recipe } from "./Typography.recipe";

export type H6Props = RecipeVariantProps<typeof h6Recipe> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H6 = (props: H6Props) => {
  const [variantProps, localProps] = h6Recipe.splitVariantProps(props);
  const { className, children, ...restProps } = localProps;

  return (
    <h6 className={cx(h6Recipe(variantProps), className)} {...restProps}>
      {children}
    </h6>
  );
};
