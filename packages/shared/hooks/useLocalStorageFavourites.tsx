"use client";

import { useState, useEffect, useCallback } from "react";

const FAVOURITES_KEY = "bsc-favourites";

export const useLocalStorageFavourites = () => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favourites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVOURITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavourites(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading favourites from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favourites to localStorage whenever favourites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
      } catch (error) {
        console.error("Error saving favourites to localStorage:", error);
      }
    }
  }, [favourites, isLoaded]);

  const addFavourite = useCallback((vehicleId: string) => {
    setFavourites((prev) => {
      if (!prev.includes(vehicleId)) {
        return [...prev, vehicleId];
      }
      return prev;
    });
  }, []);

  const removeFavourite = useCallback((vehicleId: string) => {
    setFavourites((prev) => prev.filter((id) => id !== vehicleId));
  }, []);

  const toggleFavourite = useCallback((vehicleId: string) => {
    setFavourites((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  }, []);

  const isFavourite = useCallback(
    (vehicleId: string) => favourites.includes(vehicleId),
    [favourites]
  );

  const clearAllFavourites = useCallback(() => {
    setFavourites([]);
  }, []);

  const getFavouritesCount = useCallback(() => favourites.length, [favourites]);

  const getAllFavourites = useCallback(() => [...favourites], [favourites]);

  return {
    favourites,
    isLoaded,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    isFavourite,
    clearAllFavourites,
    getFavouritesCount,
    getAllFavourites,
  };
};
