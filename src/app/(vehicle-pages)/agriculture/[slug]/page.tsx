import { Params } from "@/src/types/next-types";
import {
  getAllFeaturedDealersAndVehiclesWithImages,
  getAllVehiclesByVehicleCategory,
  getAllDealers,
} from "@/src/server/actions/general";
import { AllVehicles } from "@/src/components/Pages/VehiclePages";

export const AgriculturePage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === "rentals";

  const [
    allFeatureCarsWithDealersResponse,
    featuredCarsResponse,
    featuredDealersResponse,
  ] = await Promise.all([
    getAllFeaturedDealersAndVehiclesWithImages(
      "agriculture",
      isRental ? "rental" : "for_sale"
    ),
    getAllVehiclesByVehicleCategory(
      "agriculture",
      isRental ? "rental" : "for_sale"
    ),
    getAllDealers(),
  ]);

  // get dealer by car owner_id
  const featuredVehiclesWithDealerDetails = featuredCarsResponse?.data?.map(
    (car) => {
      const dealer = featuredDealersResponse?.data?.find(
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
    }
  );

  const { error: carsError, status: carsStatus } = featuredCarsResponse;
  const { error: dealerError, status: dealerStatus } = featuredDealersResponse;
  const {
    data: featuredCarsWithDealerDetails,
    error: featureError,
    status: featureSatus,
  } = allFeatureCarsWithDealersResponse;

  const error = carsError || dealerError || featureError;
  const status = carsStatus || dealerStatus || featureSatus;

  return (
    <AllVehicles
      vehicleCategory="agriculture"
      vehicles={featuredVehiclesWithDealerDetails || []}
      featruredVehiclesWithDealerDetails={featuredCarsWithDealerDetails || []}
      error={error}
      status={status}
      isRental={isRental}
    />
  );
};

export default AgriculturePage;
