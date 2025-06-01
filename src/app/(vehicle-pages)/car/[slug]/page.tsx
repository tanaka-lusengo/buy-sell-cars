import { Params } from "@/src/types/next-types";
import { AllVehicles } from "@/src/components/Pages/VehiclePages";
import {
  getAllFeaturedDealersAndVehiclesWithImages,
  getAllVehiclesByVehicleCategory,
  getAllDealers,
} from "@/src/server/actions/general";

export const AllCarsPage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === "rentals";

  const [allFeatureCarsWithDealersResponse, vehicleResponse, dealersResponse] =
    await Promise.all([
      getAllFeaturedDealersAndVehiclesWithImages(
        "car",
        isRental ? "rental" : "for_sale"
      ),
      getAllVehiclesByVehicleCategory("car", isRental ? "rental" : "for_sale"),
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
        subscription: dealer?.subscription,
      },
    };
  });

  const { error: carsError, status: carsStatus } = vehicleResponse;
  const { error: dealerError, status: dealerStatus } = dealersResponse;
  const {
    data: featuredCarsWithDealerDetails,
    error: featureError,
    status: featureSatus,
  } = allFeatureCarsWithDealersResponse;

  const error = carsError || dealerError || featureError;
  const status = carsStatus || dealerStatus || featureSatus;

  return (
    <AllVehicles
      vehicleCategory="car"
      vehicles={vehiclesWithDealerDetails || []}
      featruredVehiclesWithDealerDetails={featuredCarsWithDealerDetails || []}
      error={error}
      status={status}
      isRental={isRental}
    />
  );
};

export default AllCarsPage;
