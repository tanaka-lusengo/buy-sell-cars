import { type Metadata } from "next";
import { getAllProfilesByUserCategory } from "@/src/server/actions/general";
import { UserListings } from "@/src/components/Admin";
import { ParamsWithUserCategory } from "@/src/types/next-types";

export const metadata: Metadata = {
  title: "Admin | User Management",
  description: "View and manage your vehicle listings",
};

const UserListingsPage = async ({ params }: ParamsWithUserCategory) => {
  const { user_category } = await params;

  const { data, error, status } = await getAllProfilesByUserCategory(
    user_category,
    true
  );

  return (
    <UserListings
      userCategory={user_category}
      profiles={data || []}
      error={error}
      status={status}
    />
  );
};

export default UserListingsPage;
