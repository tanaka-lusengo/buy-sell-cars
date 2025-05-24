import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { getAllVehiclesByOwnerId } from "@/src/server/actions/general";
import { Listings } from "@/src/components/Pages";

const ListingsPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data, error, status } = await getAllVehiclesByOwnerId(user.id);

  return <Listings vehicles={data || []} error={error} status={status} />;
};

export default ListingsPage;
