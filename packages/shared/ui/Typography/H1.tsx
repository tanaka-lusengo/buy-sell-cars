"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { h1Recipe } from "./Typography.recipe";

export type H1Props = RecipeVariantProps<typeof h1Recipe> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H1 = (props: H1Props) => {
  const [variantProps, localProps] = h1Recipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <h1 className={cx(h1Recipe(variantProps), className)} {...restProps} />
  );
};
