import { Metadata } from "next";
import { FavouritesPage } from "@/src/components/Pages/Favourites";

export const metadata: Metadata = {
  title: "My Favourites",
  description: "View and manage your favourite vehicles",
};

export default function Favourites() {
  return <FavouritesPage />;
}
