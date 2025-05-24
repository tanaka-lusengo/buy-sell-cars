"use client";

import { styled } from "@/styled-system/jsx";
import { buttonRecipe } from "./Button.recipe";
import type { RecipeVariantProps } from "@/styled-system/css";
import type { HTMLStyledProps } from "@/styled-system/jsx";

export type ButtonProps = RecipeVariantProps<typeof buttonRecipe> &
  HTMLStyledProps<"button">;

export const Button = styled("button", buttonRecipe);
