import { Params } from "@/src/types/next-types";

export const TrucksDetailPage = async ({ params }: Params) => {
  const { slug } = await params;

  return (
    <div>
      <h1>Trucks : {slug}</h1>
      {/* Render details for the specific car type */}
    </div>
  );
};

export default TrucksDetailPage;
