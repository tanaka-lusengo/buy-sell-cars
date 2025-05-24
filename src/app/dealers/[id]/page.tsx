import { ParamsWithId } from "@/src/types/next-types";
import {
  getAllVehiclesByOwnerId,
  getProfileById,
} from "@/src/server/actions/general";
import { DealerDetails } from "@/src/components/Pages/Dealers";

const DealerDetailPage = async ({ params }: ParamsWithId) => {
  const { id } = await params;

  // Fetch all vehicle details using the provided ID
  const {
    data: vehicleData,
    status,
    error,
  } = await getAllVehiclesByOwnerId(id);

  // If vehicle data is not available, return an error state early
  if (!vehicleData) {
    return (
      <DealerDetails
        vehicles={null}
        owner={null}
        error={error || "Vehicle not found"}
        status={status}
      />
    );
  }

  // Fetch the owner's profile data using the owner ID from the vehicle data
  const { data: profileData, error: profileError } = await getProfileById(id);

  return (
    <DealerDetails
      vehicles={vehicleData}
      owner={profileData}
      error={error || profileError}
      status={status}
    />
  );
};

export default DealerDetailPage;
