'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import { Box, Flex, VStack } from '@/styled-system/jsx';
import { Typography } from '../../ui';
import { VehicleWithImage } from '@/src/types';
import { createClient } from '@/supabase/client';
import { useFileUploadHelpers } from '@/src/hooks';
import { formatPriceToDollars, formatMileage } from '@/src/utils';

type CarPreviewCardProps = {
  car: VehicleWithImage;
  isRental: boolean;
};

export const CarPreviewCard = ({ car, isRental }: CarPreviewCardProps) => {
  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const carPrice = useMemo(() => formatPriceToDollars(car.price), [car.price]);
  const carMileage = useMemo(
    () => formatMileage(car.mileage || 0),
    [car.mileage]
  );

  const isUsedCar = car.condition === 'used';

  return (
    <Box
      bg="white"
      borderRadius="1.2rem"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      _hover={{
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
        transform: 'scale(1.01)',
      }}
      transition="all 0.3s ease-in-out"
    >
      <Link href={`/cars/${isRental ? 'rentals' : 'sales'}/${car.id}`} passHref>
        <VStack alignItems="flex-start" padding="sm">
          <Box
            position="relative"
            width="290px"
            height={{ base: '180px', md: '220px' }}
            borderRadius="1.2rem"
            overflow="hidden"
          >
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
          </Box>

          <Flex
            direction="column"
            justifyContent="space-between"
            gap="sm"
            width="100%"
          >
            <Box>
              <Typography variant="body2">{car.year}</Typography>
              <Typography weight="bold" variant="h3">
                {car.make} {car.model}
              </Typography>
              <Typography color="grey">{carMileage} miles</Typography>
            </Box>

            <Box>
              <Typography variant="h3" weight="bold">
                {carPrice}{' '}
                {isRental ? (
                  <Typography as="span" variant="h4">
                    / per day
                  </Typography>
                ) : (
                  ''
                )}
              </Typography>
              <Typography>{isUsedCar ? 'Pre-owned' : 'Brand new'}</Typography>
              <Typography>{car.location}</Typography>
            </Box>
          </Flex>
        </VStack>
      </Link>
    </Box>
  );
};
