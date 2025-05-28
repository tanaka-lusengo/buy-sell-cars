import { Params } from "@/src/types/next-types";
import { AllVehicles } from "@/src/components/Pages/VehiclePages";
import {
  getAllVehiclesByVehicleCategory,
  getAllDealers,
} from "@/src/server/actions/general";

export const AllTrucksPage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === "rentals";

  const [vehicleResponse, dealersResponse] = await Promise.all([
    getAllVehiclesByVehicleCategory("truck", isRental ? "rental" : "for_sale"),
    getAllDealers(),
  ]);

  // get dealer by car owner_id
  const vehiclesWithDealerDetails = vehicleResponse?.data?.map((car) => {
    const dealer = dealersResponse?.data?.find(
      (dealer) => dealer.id === car.owner_id
    );

    return {
      ...car,
      dealer: {
        dealership_name: dealer?.dealership_name,
        profile_logo_path: dealer?.profile_logo_path,
      },
    };
  });

  const { error: carsError, status: carsStatus } = vehicleResponse;
  const { error: dealerError, status: dealerStatus } = dealersResponse;

  return (
    <AllVehicles
      vehicleCategory="truck"
      vehicles={vehiclesWithDealerDetails || []}
      error={carsError || dealerError}
      status={carsStatus || dealerStatus}
      isRental={isRental}
    />
  );
};

export default AllTrucksPage;
