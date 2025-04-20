'use client';

import { styled } from '@/styled-system/jsx';
import { containerRecipe } from './Container.recipe';
import type { RecipeVariantProps } from '@/styled-system/css';
import type { HTMLStyledProps } from '@/styled-system/jsx';

type ComponentVariants = 'div' | 'section';

export type ContainerProps = {
  component?: ComponentVariants;
  children: React.ReactNode;
} & RecipeVariantProps<typeof containerRecipe> &
  HTMLStyledProps<'div'>;

export const Container = ({
  component = 'div',
  children,
  className,
  ...props
}: ContainerProps) => {
  const Component = styled(component, containerRecipe);

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};
