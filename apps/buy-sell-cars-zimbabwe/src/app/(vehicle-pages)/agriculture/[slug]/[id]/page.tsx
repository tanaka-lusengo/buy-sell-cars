import { ParamsWithId } from "~bsc-shared/types/next-types";
import { PostHogVehicleViewTracker } from "@/src/components/Analytics";
import { VehicleDetails } from "@/src/components/Pages/VehiclePages";
import {
  getVehicleById,
  getProfileById,
  getAllVehiclesByOwnerId,
} from "@/src/server/actions/general";

const AgricultureDetailPage = async ({ params }: ParamsWithId) => {
  const { id } = await params;

  // Fetch vehicle details using the provided ID
  const {
    data: vehicleData,
    status: vehicleByIdStatus,
    error: vehicleByIdError,
  } = await getVehicleById(id);

  // If vehicle data is not available, return an error state early
  if (!vehicleData) {
    return (
      <VehicleDetails
        vehicleCategory="agriculture"
        vehicle={null}
        owner={null}
        error={vehicleByIdError || "Vehicle not found"}
        status={vehicleByIdStatus}
      />
    );
  }

  // Fetch the owner's profile data using the owner ID from the vehicle data
  const {
    data: ownerData,
    status: ownerStatus,
    error: ownerError,
  } = await getProfileById(vehicleData.owner_id);

  // Fetch all vehicles by owner ID
  const {
    data: allVehiclesByOwner,
    status: allVehiclesStatusByOwner,
    error: allVehiclesErrorByOwner,
  } = await getAllVehiclesByOwnerId(ownerData?.id || "");

  const status = vehicleByIdStatus || ownerStatus || allVehiclesStatusByOwner;
  const error = vehicleByIdError || ownerError || allVehiclesErrorByOwner;

  return (
    <>
      <VehicleDetails
        vehicleCategory="agriculture"
        vehicle={vehicleData}
        allVehiclesByOwner={allVehiclesByOwner}
        owner={ownerData}
        error={error}
        status={status}
      />
      <PostHogVehicleViewTracker
        vehicleData={{
          vehicleId: vehicleData.id,
          ownerId: vehicleData.owner_id,
          ownerName:
            ownerData?.user_category === "dealership"
              ? ownerData.dealership_name || "Unknown Dealership"
              : "Individual Owner",
          vehicleType: "agriculture",
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          sourcePage: "vehicle_detail_page",
        }}
      />
    </>
  );
};

export default AgricultureDetailPage;
