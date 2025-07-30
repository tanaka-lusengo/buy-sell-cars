"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { h4Recipe } from "./Typography.recipe";

export type H4Props = RecipeVariantProps<typeof h4Recipe> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H4 = (props: H4Props) => {
  const [variantProps, localProps] = h4Recipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h4 className={cx(h4Recipe(variantProps), className)} {...restProps} />
  );
};
