import { ParamsWithId } from '@/src/types/next-types';
import { getVehicleById } from '@/src/server/actions/general';
import { CarDetails } from '@/src/components/Pages/VehiclePages';

const CarDetailPage = async ({ params }: ParamsWithId) => {
  const { id } = await params;

  const { data, status, error } = await getVehicleById(id);

  return <CarDetails car={data} error={error} status={status} />;
};

export default CarDetailPage;
