import "./globals.css";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { metadata } from "./metadata";
import { PreloadResources } from "./preload-resources";
import { Navbar, Footer } from "../components/Layout";
import { AuthProvider } from "@/src/context/auth-context";
import Toaster from "@/src/utils/reactHotToast/Toaster";
import { createClient } from "@/supabase/server";

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
        {/* Vercel Analytics and Speed Insights for monitoring app usage and performance */}
        <Analytics />
        <SpeedInsights />

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
