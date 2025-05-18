import {
  HeroBanner,
  FeaturedCarSection,
  InfoSection,
  FeaturedDealersSection,
  SocialMediaSection,
} from '@/src/components/Pages';
import { getAllCarsByCategory, getAllDealers } from '../server/actions/general';

export const Home = async () => {
  const [featuredCarsResponse, featuredDealersResponse] = await Promise.all([
    getAllCarsByCategory('for_sale'),
    getAllDealers(),
  ]);

  return (
    <>
      <HeroBanner />
      <FeaturedCarSection featuredCars={featuredCarsResponse} />
      <FeaturedDealersSection featuredDealers={featuredDealersResponse} />
      <InfoSection />
      <SocialMediaSection />
    </>
  );
};

export default Home;
