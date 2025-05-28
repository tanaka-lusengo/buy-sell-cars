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
  getAllCarsByListingCategory,
  getAllDealers,
} from "../server/actions/general";

export const Home = async () => {
  const [allCarsForSaleResponse, allDealersResponse] = await Promise.all([
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
          dealership_name: dealer?.dealership_name,
          profile_logo_path: dealer?.profile_logo_path,
        },
      };
    }
  );

  return (
    <>
      <HeroBanner />
      <FeaturedCarSection
        featuredCarsWithDealerDetails={allCarsForSaleWithDealerDetails}
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
