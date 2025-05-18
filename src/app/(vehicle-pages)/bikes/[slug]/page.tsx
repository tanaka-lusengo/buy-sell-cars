import { Params } from '@/src/types/next-types';

export const BikesDetailPage = async ({ params }: Params) => {
  const { slug } = await params;

  return (
    <div>
      <h1>Bikes Details: {slug}</h1>
      {/* Render details for the specific car type */}
    </div>
  );
};

export default BikesDetailPage;
