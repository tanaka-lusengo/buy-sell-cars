import { StatusCode } from "~bsc-shared/utils";
import {
  HeroBanner,
  FeatureBannerOne,
  FeatureBannerTwo,
  FeaturedCarSection,
  BrowseCarsSection,
  InfoSection,
  FeaturedDealersSection,
  SocialMediaSection,
} from "@/src/components/Pages";
import { SubscribeModal } from "@/src/components/SubscribeModal";
import {
  getAllFeaturedDealersAndVehiclesWithImages,
  getAllCarsByListingCategory,
  getAllDealers,
  getProfileSubscriptionDetails,
} from "../server/actions/general";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export const Home = async () => {
  const [
    allFeatureCarsWithDealersResponse,
    allCarsForSaleResponse,
    allDealersResponse,
  ] = await Promise.all([
    getAllFeaturedDealersAndVehiclesWithImages("car", "for_sale"),
    getAllCarsByListingCategory("for_sale", true),
    getAllDealers(),
  ]);

  // Get dealer by car owner_id
  const allCarsForSaleWithDealerDetails = allCarsForSaleResponse?.data
    ? await Promise.all(
        allCarsForSaleResponse.data.map(async (car) => {
          const dealer = allDealersResponse?.data?.find(
            (dealer) => dealer.id === car.owner_id
          );

          const { data: dealerSubDetails } =
            await getProfileSubscriptionDetails(dealer?.id || "");

          return {
            ...car,
            dealer: {
              id: dealer?.id,
              dealership_name: dealer?.dealership_name,
              profile_logo_path: dealer?.profile_logo_path,
              subscription: dealerSubDetails?.subscription_name || null,
            },
          };
        })
      )
    : undefined;

  const {
    data: featuredCarsWithDealerDetails,
    error: carsError,
    status: carsStatus,
  } = allFeatureCarsWithDealersResponse;

  if (carsError || carsStatus !== StatusCode.SUCCESS) {
    console.error("Error fetching featured cars:", carsError);
  }

  return (
    <>
      <HeroBanner />
      <FeaturedCarSection
        featuredCarsWithDealerDetails={featuredCarsWithDealerDetails || []}
      />
      <BrowseCarsSection
        allCarsForSaleWithDealerDetails={allCarsForSaleWithDealerDetails}
      />
      <FeatureBannerOne />
      <InfoSection />
      <FeaturedDealersSection featuredDealers={allDealersResponse} />
      <FeatureBannerTwo />
      <SocialMediaSection />
      <SubscribeModal />
    </>
  );
};

export default Home;
