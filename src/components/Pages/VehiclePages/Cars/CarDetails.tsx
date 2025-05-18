'use client';

import Image from 'next/image';
import { Container, Box, Flex, Grid } from '@/styled-system/jsx';
import { ResponsiveContainer, Typography } from '../../../ui';
import { StatusCode } from '@/src/utils';
import { VehicleWithImage } from '@/src/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useFileUploadHelpers } from '@/src/hooks';
import { createClient } from '@/supabase/client';

type CarDetailsProps = {
  car: VehicleWithImage | null;
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const CarDetails = ({ car, error, status }: CarDetailsProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <Typography variant="h2">
            {car?.condition}: {car?.make} {car?.model}
          </Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md">
              <Typography as="h2" variant="h3" color="error">
                Error fetching car
              </Typography>

              <Typography color="error">
                Please try again a later time
              </Typography>
              {error === typeof 'string' && (
                <Typography color="error">{error}</Typography>
              )}
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && !car && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Typography variant="h4" align="center">
                No car found
              </Typography>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && car && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Grid>
                <Image
                  src={getPublicUrl(
                    'vehicle-images',
                    car.images[0]?.image_path ?? ''
                  )}
                  alt={`${car.id}: Car: ${car.make}`}
                  fill
                  objectFit="cover"
                  style={{
                    borderRadius: '1.2rem',
                  }}
                />
                <Typography variant="h4" align="center">
                  {car.make}
                </Typography>
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}
      </Container>
    </>
  );
};
