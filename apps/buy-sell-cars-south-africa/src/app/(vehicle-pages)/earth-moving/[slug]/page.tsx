import { AllVehicles } from "@/src/components/Pages/VehiclePages";
import {
  getAllFeaturedDealersAndVehiclesWithImages,
  getAllVehiclesByVehicleCategory,
  getAllDealers,
} from "@/src/server/actions/general";
import { Params } from "@/src/types/next-types";

export const AllEarthMovingEquipmentPage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === "rentals";
  const listingCategory = isRental ? "rental" : "for_sale";

  const [featuredResponse, vehiclesResponse, dealersResponse] =
    await Promise.all([
      getAllFeaturedDealersAndVehiclesWithImages(
        "earth_moving",
        listingCategory
      ),
      getAllVehiclesByVehicleCategory("earth_moving", listingCategory),
      getAllDealers(),
    ]);

  // get dealer by owner_id
  const vehicles = vehiclesResponse?.data?.map((vehicle) => {
    const dealer = dealersResponse?.data?.find(
      (dealer) => dealer.id === vehicle.owner_id
    );

    return {
      ...vehicle,
      dealer: {
        id: dealer?.id,
        dealership_name: dealer?.dealership_name,
        profile_logo_path: dealer?.profile_logo_path,
        subscription: dealer?.subscription,
      },
    };
  });

  const { error: vehiclesError, status: vehiclesStatus } = vehiclesResponse;
  const { error: dealersError, status: dealersStatus } = dealersResponse;
  const {
    data: featuredVehicles,
    error: featureError,
    status: featureSatus,
  } = featuredResponse;

  const error = vehiclesError || dealersError || featureError;
  const status = vehiclesStatus || dealersStatus || featureSatus;

  return (
    <AllVehicles
      vehicleCategory="earth_moving"
      vehicles={vehicles || []}
      featruredVehicles={featuredVehicles || []}
      error={error}
      status={status}
      isRental={isRental}
    />
  );
};

export default AllEarthMovingEquipmentPage;
