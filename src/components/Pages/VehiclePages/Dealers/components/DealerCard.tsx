import Image from 'next/image';
import Link from 'next/link';
import { Profile } from '@/src/types';
import { useFileUploadHelpers } from '@/src/hooks';
import { createClient } from '@/supabase/client';
import { Box } from '@/styled-system/jsx';
import { Typography } from '@/src/components/ui';

export const DealerCard = ({ dealer }: { dealer: Profile }) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  return (
    <Link href={`/dealers/${dealer.dealership_name}`}>
      <Box width="100%" maxWidth="fit-content">
        <Image
          src={getPublicUrl('profile-logos', dealer.profile_logo_path ?? '')}
          alt={`${dealer.dealership_name} logo`}
          width={325}
          height={200}
          objectFit="cover"
          objectPosition="center"
          style={{
            height: 'auto',
            borderTopLeftRadius: '1.2rem',
            borderTopRightRadius: '1.2rem',
          }}
        />
        <Box
          borderTop="none"
          border="1.5px solid"
          borderColor="grey"
          borderBottomRadius="1.2rem"
          paddingY="md"
          paddingLeft="sm"
        >
          <Typography variant="h4" weight="bold">
            {dealer.dealership_name}
          </Typography>
          <Typography>{dealer.email}</Typography>
          <Typography>{dealer.phone}</Typography>
          <Typography>{dealer.location}</Typography>
        </Box>
      </Box>
    </Link>
  );
};
