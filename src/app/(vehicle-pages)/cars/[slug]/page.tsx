import { Params } from "@/src/types/next-types";
import { AllCars } from "@/src/components/Pages/VehiclePages";
import {
  getAllCarsByListingCategory,
  getAllDealers,
} from "@/src/server/actions/general";

export const AllCarsPage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === "rentals";

  const [featuredCarsResponse, featuredDealersResponse] = await Promise.all([
    getAllCarsByListingCategory(isRental ? "rental" : "for_sale"),
    getAllDealers(),
  ]);

  // get dealer by car owner_id
  const featuredCarsWithDealerDetails = featuredCarsResponse?.data?.map(
    (car) => {
      const dealer = featuredDealersResponse?.data?.find(
        (dealer) => dealer.id === car.owner_id
      );

      return {
        ...car,
        dealer: {
          dealership_name: dealer?.dealership_name,
          profile_logo_path: dealer?.profile_logo_path,
        },
      };
    }
  );

  const { error: carsError, status: carsStatus } = featuredCarsResponse;
  const { error: dealerError, status: dealerStatus } = featuredDealersResponse;

  return (
    <AllCars
      cars={featuredCarsWithDealerDetails || []}
      error={carsError || dealerError}
      status={carsStatus || dealerStatus}
      isRental={isRental}
    />
  );
};

export default AllCarsPage;
