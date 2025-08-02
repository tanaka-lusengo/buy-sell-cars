"use client";

import { useState } from "react";
import type { RecipeVariantProps } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import type { HTMLStyledProps } from "@/styled-system/jsx";
import { favouriteButtonRecipe } from "./FavouriteButton.recipe";

export type FavouriteButtonProps = RecipeVariantProps<
  typeof favouriteButtonRecipe
> &
  Omit<HTMLStyledProps<"button">, "onClick"> & {
    vehicleId: string;
    onFavouriteToggle?: (
      vehicleId: string,
      isFavourite: boolean
    ) => Promise<void>;
    disabled?: boolean;
  };

const StyledButton = styled("button", favouriteButtonRecipe);

export const FavouriteButton = ({
  vehicleId,
  isFavourite = false,
  onFavouriteToggle,
  disabled = false,
  ...props
}: FavouriteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading || !onFavouriteToggle) return;

    setIsLoading(true);
    try {
      await onFavouriteToggle(vehicleId, isFavourite);
    } catch (error) {
      console.error("Error toggling favourite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledButton
      {...props}
      isFavourite={isFavourite}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      title={isFavourite ? "Remove from favourites" : "Add to favourites"}
    >
      <i
        className={`fa-${isFavourite ? "solid" : "regular"} fa-heart heart-icon`}
        style={{
          fontSize: "15px",
          color: isFavourite ? "#ef4444" : "#6b7280",
        }}
        aria-hidden="true"
      />
    </StyledButton>
  );
};
