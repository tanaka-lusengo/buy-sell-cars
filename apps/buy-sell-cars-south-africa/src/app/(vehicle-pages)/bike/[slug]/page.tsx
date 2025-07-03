import { AllVehicles } from "@/src/components/Pages/VehiclePages";
import {
  getAllFeaturedDealersAndVehiclesWithImages,
  getAllVehiclesByVehicleCategory,
  getAllDealers,
  getProfileSubscriptionDetails,
} from "@/src/server/actions/general";
import { Params } from "@/src/types/next-types";

export const AllBikesPage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === "rentals";
  const listingCategory = isRental ? "rental" : "for_sale";

  const [featuredResponse, vehiclesResponse, dealersResponse] =
    await Promise.all([
      getAllFeaturedDealersAndVehiclesWithImages("bike", listingCategory),
      getAllVehiclesByVehicleCategory("bike", listingCategory),
      getAllDealers(),
    ]);

  // get dealer by owner_id
  const vehicles = vehiclesResponse?.data
    ? await Promise.all(
        vehiclesResponse.data.map(async (vehicle) => {
          const dealer = dealersResponse?.data?.find(
            (dealer) => dealer.id === vehicle.owner_id
          );

          const { data: dealerSubDetails, error } =
            await getProfileSubscriptionDetails(dealer?.id || "");

          if (error) {
            console.error("Error fetching dealer subscription details:", error);
          }

          const hasDealershipName =
            typeof dealer?.dealership_name === "string" &&
            dealer.dealership_name.trim().length > 0;

          return {
            ...vehicle,
            dealer: {
              id: dealer?.id,
              dealership_name: hasDealershipName
                ? dealer?.dealership_name
                : `${dealer?.first_name} ${dealer?.last_name}`,
              profile_logo_path: dealer?.profile_logo_path,
              subscription: dealerSubDetails?.subscription_name || null,
            },
          };
        })
      )
    : [];

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
      vehicleCategory="bike"
      vehicles={vehicles || []}
      featruredVehicles={featuredVehicles || []}
      error={error}
      status={status}
      isRental={isRental}
    />
  );
};

export default AllBikesPage;
