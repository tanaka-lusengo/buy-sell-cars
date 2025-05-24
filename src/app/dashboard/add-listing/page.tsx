import { type Metadata } from "next";
import { AddListing } from "@/src/components/Pages/Dashboard";

export const metadata: Metadata = {
  title: "Add Listing",
  description: "Add a new listing to your account",
};

export default function AddListingPage() {
  return <AddListing />;
}
