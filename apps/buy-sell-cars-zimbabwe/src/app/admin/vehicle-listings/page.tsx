import { type Metadata } from "next";
import { getAllVehicles } from "@/src/server/actions/general";
import { VehicleListings } from "@/src/components/Admin";

export const metadata: Metadata = {
  title: "Admin | Vehicle Management",
  description: "View and manage your vehicle listings",
};

const ListingsPage = async () => {
  const { data, error, status } = await getAllVehicles();

  return (
    <VehicleListings vehicles={data || []} error={error} status={status} />
  );
};

export default ListingsPage;
