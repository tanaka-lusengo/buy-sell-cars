"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useLocalStorageFavourites } from "~bsc-shared/hooks";
import {
  addFavourite,
  removeFavourite,
  getUserFavourites,
} from "@/src/server/actions/analytics";
import { useAuth } from "./auth-context";

type FavouritesContextType = {
  favourites: string[];
  isLoaded: boolean;
  addToFavourites: (vehicleId: string) => Promise<void>;
  removeFromFavourites: (vehicleId: string) => Promise<void>;
  toggleFavourite: (vehicleId: string) => Promise<void>;
  isFavourite: (vehicleId: string) => boolean;
  getFavouritesCount: () => number;
  clearAllFavourites: () => Promise<void>;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(
  undefined
);

export const FavouritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, profile } = useAuth();
  const localStorage = useLocalStorageFavourites();
  const [databaseFavourites, setDatabaseFavourites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);

  // Destructure localStorage functions to avoid dependency issues
  const {
    favourites: localStorageFavourites,
    isLoaded: localStorageIsLoaded,
    addFavourite: addLocalStorageFavourite,
    removeFavourite: removeLocalStorageFavourite,
    getAllFavourites: getAllLocalStorageFavourites,
    clearAllFavourites: clearAllLocalStorageFavourites,
  } = localStorage;

  // Determine if user is authenticated
  const isAuthenticated = Boolean(user && profile);

  // Get current favourites based on authentication status
  const favourites = useMemo(() => {
    if (isAuthenticated) {
      return databaseFavourites;
    }
    return localStorageFavourites;
  }, [isAuthenticated, databaseFavourites, localStorageFavourites]);

  // Load database favourites and handle migration for authenticated users
  useEffect(() => {
    const loadDatabaseFavouritesAndMigrate = async () => {
      if (isAuthenticated && profile?.id && localStorageIsLoaded) {
        try {
          // First, always load existing database favourites
          const result = await getUserFavourites(profile.id);
          if (result.status === 200 && result.data) {
            setDatabaseFavourites(result.data);
          }

          // Check if we need to migrate from localStorage
          const localStorageFavsToMigrate = getAllLocalStorageFavourites();

          if (localStorageFavsToMigrate.length > 0 && !hasMigrated) {
            // Migrate localStorage favourites to database one by one
            let migrationSuccess = true;
            const successfulMigrations: string[] = [];

            for (const vehicleId of localStorageFavsToMigrate) {
              try {
                const migrationResult = await addFavourite(
                  profile.id,
                  vehicleId
                );
                if (
                  migrationResult.status === 200 ||
                  migrationResult.error === "Already favourited"
                ) {
                  successfulMigrations.push(vehicleId);
                } else {
                  console.error(
                    `Failed to migrate favourite ${vehicleId}:`,
                    migrationResult.error
                  );
                  migrationSuccess = false;
                }
              } catch (error) {
                console.error(`Error migrating favourite ${vehicleId}:`, error);
                migrationSuccess = false;
              }
            }

            if (migrationSuccess || successfulMigrations.length > 0) {
              // Reload database favourites after migration
              const updatedResult = await getUserFavourites(profile.id);
              if (updatedResult.status === 200 && updatedResult.data) {
                setDatabaseFavourites(updatedResult.data);
              }

              // Clear localStorage after successful migration and reload
              clearAllLocalStorageFavourites();
              setHasMigrated(true);
            } else {
              console.error("Migration failed completely");
            }
          }
        } catch (error) {
          console.error(
            "Error loading database favourites or migrating:",
            error
          );
        }
      }
      setIsLoaded(true);
    };

    loadDatabaseFavouritesAndMigrate();
  }, [isAuthenticated, profile?.id, localStorageIsLoaded, hasMigrated]);

  const addToFavourites = useCallback(
    async (vehicleId: string) => {
      if (isAuthenticated && profile?.id) {
        try {
          const result = await addFavourite(profile.id, vehicleId);

          if (result.status === 200 || result.error === "Already favourited") {
            setDatabaseFavourites((prev) => {
              const updated = prev.includes(vehicleId)
                ? prev
                : [...prev, vehicleId];

              return updated;
            });
          } else {
            console.error("Failed to add favourite:", result);
          }
        } catch (error) {
          console.error("Error adding favourite to database:", error);
        }
      } else {
        addLocalStorageFavourite(vehicleId);
      }
    },
    [isAuthenticated, profile?.id, addLocalStorageFavourite]
  );

  const removeFromFavourites = useCallback(
    async (vehicleId: string) => {
      if (isAuthenticated && profile?.id) {
        try {
          const result = await removeFavourite(profile.id, vehicleId);
          if (result.status === 200) {
            setDatabaseFavourites((prev) =>
              prev.filter((id) => id !== vehicleId)
            );
          }
        } catch (error) {
          console.error("Error removing favourite from database:", error);
        }
      } else {
        removeLocalStorageFavourite(vehicleId);
      }
    },
    [isAuthenticated, profile?.id, removeLocalStorageFavourite]
  );

  const toggleFavourite = useCallback(
    async (vehicleId: string) => {
      const currentFavourites = isAuthenticated
        ? databaseFavourites
        : localStorageFavourites;

      if (currentFavourites.includes(vehicleId)) {
        await removeFromFavourites(vehicleId);
      } else {
        await addToFavourites(vehicleId);
      }
    },
    [
      isAuthenticated,
      databaseFavourites,
      localStorageFavourites,
      addToFavourites,
      removeFromFavourites,
    ]
  );

  const isFavourite = useCallback(
    (vehicleId: string) => {
      return favourites.includes(vehicleId);
    },
    [favourites]
  );

  const getFavouritesCount = useCallback(() => {
    return favourites.length;
  }, [favourites]);

  const clearAllFavourites = useCallback(async () => {
    if (isAuthenticated) {
      // TODO: Implement bulk delete for database favourites
      setDatabaseFavourites([]);
    } else {
      clearAllLocalStorageFavourites();
    }
  }, [isAuthenticated, clearAllLocalStorageFavourites]);

  const contextValue = useMemo(
    () => ({
      favourites,
      isLoaded: isLoaded && localStorageIsLoaded,
      addToFavourites,
      removeFromFavourites,
      toggleFavourite,
      isFavourite,
      getFavouritesCount,
      clearAllFavourites,
    }),
    [
      favourites,
      isLoaded,
      localStorageIsLoaded,
      addToFavourites,
      removeFromFavourites,
      toggleFavourite,
      isFavourite,
      getFavouritesCount,
      clearAllFavourites,
    ]
  );

  return (
    <FavouritesContext.Provider value={contextValue}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);

  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }

  return context;
};
