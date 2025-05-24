import { Params } from "@/src/types/next-types";

export const EarthMovingDetailPage = async ({ params }: Params) => {
  const { slug } = await params;

  return (
    <div>
      <h1>Earth Moving Details: {slug}</h1>
      {/* Render details for the specific car type */}
    </div>
  );
};

export default EarthMovingDetailPage;
