import { StatusCode } from "~bsc-shared/utils";
import {
  HeroBanner,
  // FeatureBannerOne,
  // FeatureBannerTwo,
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
} from "../server/actions/general";

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
  const allCarsForSaleWithDealerDetails = allCarsForSaleResponse?.data?.map(
    (car) => {
      const dealer = allDealersResponse?.data?.find(
        (dealer) => dealer.id === car.owner_id
      );

      return {
        ...car,
        dealer: {
          id: dealer?.id,
          dealership_name: dealer?.dealership_name,
          profile_logo_path: dealer?.profile_logo_path,
          subscription: dealer?.subscription,
        },
      };
    }
  );

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
      {/* <FeatureBannerOne /> */}
      <InfoSection />
      <FeaturedDealersSection featuredDealers={allDealersResponse} />
      {/* <FeatureBannerTwo /> */}
      <SocialMediaSection />
      <SubscribeModal />
    </>
  );
};

export default Home;
