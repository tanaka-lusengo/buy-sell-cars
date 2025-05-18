import Link from 'next/link';
import Image from 'next/image';
import { useFileUploadHelpers } from '@/src/hooks';
import { Profile } from '@/src/types';
import { createClient } from '@/supabase/client';
import { Typography } from '@/src/components/ui';
import { VStack, Box } from '@/styled-system/jsx';

export const FeaturedDealersCard = ({ dealer }: { dealer: Profile }) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  return (
    <Box
      bg="white"
      borderRadius="1rem"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      marginX="sm"
      _hover={{
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
        transform: 'scale(1.01)',
      }}
      transition="all 0.3s ease-in-out"
    >
      <Link href={`/dealers/${dealer.id}`} passHref>
        <VStack alignItems="center" padding="sm">
          <Box
            position="relative"
            width="200px"
            height="200px"
            borderRadius="1rem"
            overflow="hidden"
          >
            <Image
              src={getPublicUrl(
                'profile-logos',
                dealer.profile_logo_path ?? ''
              )}
              alt={dealer.dealership_name ?? ''}
              fill
              objectFit="cover"
              style={{
                borderRadius: '1rem',
              }}
            />
          </Box>

          <Typography align="center">{dealer.dealership_name}</Typography>
        </VStack>
      </Link>
    </Box>
  );
};
