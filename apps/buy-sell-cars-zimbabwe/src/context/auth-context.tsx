"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/src/types";
import { createClient } from "@/supabase/client";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
});

export const AuthProvider = ({
  children,
  initialUser,
  initialProfile,
}: {
  children: React.ReactNode;
  initialUser: User | null;
  initialProfile: Profile | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<Profile | null>(initialProfile);

  useEffect(() => {
    const supabase = createClient();

    const fetchUserAndProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Profile fetch error:", profileError);
        }
      } else {
        setProfile(profileData);
      }
    };

    // Only run fetch on mount if no initial user is present
    if (!initialUser) {
      fetchUserAndProfile();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchUserAndProfile();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialUser]);

  const contextValue = useMemo(() => ({ user, profile }), [user, profile]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return context;
};
