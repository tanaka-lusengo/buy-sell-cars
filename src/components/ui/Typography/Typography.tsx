'use client';

import { typographyRecipe } from './Typography.recipe';
import { cx, type RecipeVariantProps } from '@/styled-system/css';

export type TypographyProps = RecipeVariantProps<typeof typographyRecipe> &
  React.HTMLAttributes<HTMLElement> & {
    as?: keyof HTMLElementTagNameMap;
  };

const defaultComponentMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
} as const;

export const Typography = (props: TypographyProps) => {
  // `splitVariantProps` is a utility function that separates the recipe variant props from the rest of the props
  const [variantProps, localProps] = typographyRecipe.splitVariantProps(props);

  // Destructure the `as` prop to determine the HTML element type
  const { as, className, ...restProps } = localProps;

  const Component = as ?? defaultComponentMap[variantProps.variant ?? 'body1'];

  return (
    <Component
      className={cx(typographyRecipe(variantProps), className)}
      {...restProps}
    />
  );
};
