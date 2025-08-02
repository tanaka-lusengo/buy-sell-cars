import { Metadata } from "next";
import { FavouritesPage } from "@/src/components/Pages/Favourites";

export const metadata: Metadata = {
  title: "My Favourites",
  description:
    "View and manage your saved favourite vehicles. Keep track of cars, trucks, bikes and other vehicles you're interested in buying.",
  keywords: "favourites, saved vehicles, wishlist, buy sell cars south africa",
};

export default function Favourites() {
  return <FavouritesPage />;
}
