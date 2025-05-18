import { Params } from '@/src/types/next-types';
import { AllCars } from '@/src/components/Pages/VehiclePages';
import { getAllCarsByCategory } from '@/src/server/actions/general';

export const CarsDetailPage = async ({ params }: Params) => {
  const { slug } = await params;

  const isRental = slug === 'rentals';

  const { data, error, status } = await getAllCarsByCategory(
    isRental ? 'rental' : 'for_sale'
  );

  return (
    <AllCars
      cars={data || []}
      error={error}
      status={status}
      isRental={isRental}
    />
  );
};

export default CarsDetailPage;
