import { type StorageBucket } from '../types';

export const storageBuckets = {
  profileLogo: 'profile-logos',
  vehicleImage: 'vehicle-images',
  specSheet: 'spec-sheets',
  govtId: 'government-ids',
} as const satisfies Record<string, StorageBucket>;
