import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Toaster from "~bsc-shared/utils/reactHotToast/Toaster";
import { AuthProvider } from "@/src/context/auth-context";
import { createClient } from "@/supabase/server";
import { Navbar, Footer } from "../components/Layout";
import "./globals.css";
import { metadata } from "./metadata";
import { PreloadResources } from "./preload-resources";

// Base metadata for the app
export { metadata };

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = profileData ?? null;
  }

  return (
    <html lang="en">
      <PreloadResources />

      <body>
        {/* Vercel Analytics for monitoring app usage and performance */}
        <Analytics />

        {/* Global styles and fonts */}
        <AuthProvider initialUser={user} initialProfile={profile}>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
