"use client";

import { cx, type RecipeVariantProps } from "@/styled-system/css";
import { spanRecipe } from "./Typography.recipe";

export type SpanProps = RecipeVariantProps<typeof spanRecipe> &
  React.HTMLAttributes<HTMLSpanElement>;

export const Span = (props: SpanProps) => {
  const [variantProps, localProps] = spanRecipe.splitVariantProps(props);
  const { className, ...restProps } = localProps;

  return (
    <span className={cx(spanRecipe(variantProps), className)} {...restProps} />
  );
};
