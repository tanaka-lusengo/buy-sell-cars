"use client";

import type { RecipeVariantProps } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import type { HTMLStyledProps } from "@/styled-system/jsx";
import { linkButtonRecipe } from "./LinkButton.recipe";

export type LinkButtonProps = RecipeVariantProps<typeof linkButtonRecipe> &
  HTMLStyledProps<"button">;

export const LinkButton = styled("button", linkButtonRecipe);
