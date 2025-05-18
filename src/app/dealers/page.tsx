import { type Metadata } from 'next';
import { AllDealers } from '@/src/components/Pages';
import { getAllDealers } from '@/src/server/actions/general';

export const metadata: Metadata = {
  title: 'Dealers',
  description: 'Discover our range of dealers',
};

const DealersPage = async () => {
  const { data, error, status } = await getAllDealers();

  return <AllDealers dealers={data || []} error={error} status={status} />;
};

export default DealersPage;
