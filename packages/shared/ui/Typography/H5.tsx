"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { h5Recipe } from "./Typography.recipe";

export type H5Props = RecipeVariantProps<typeof h5Recipe> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H5 = (props: H5Props) => {
  const [variantProps, localProps] = h5Recipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <h5
      className={cx(h5Recipe(variantProps), className)}
      {...restProps}
    />
  );
};