"use client";

import type { RecipeVariantProps } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import type { HTMLStyledProps } from "@/styled-system/jsx";
import { buttonRecipe } from "./Button.recipe";

export type ButtonProps = RecipeVariantProps<typeof buttonRecipe> &
  HTMLStyledProps<"button">;

export const Button = styled("button", buttonRecipe);
