'use client';

import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { Typography } from '../../ui';
import { Box, Container, Flex } from '@/styled-system/jsx';
import {
  FeaturedCarCarouselContainer,
  CorouselViewport,
} from './common.styled';
import { usePrevNextCarouselFunctions } from '@/src/hooks/usePrevNextCarouselFunctions';
import { VehicleWithImage } from '@/src/types';
import { StatusCode } from '@/src/utils';
import { PostgrestError } from '@supabase/supabase-js';
import { CarPreviewCard } from '@/src/components/shared';
import { Filter } from './components';

type FeaturedCarsSectionProps = {
  featuredCars: {
    data: VehicleWithImage[] | null;
    status: StatusCode;
    error: string | PostgrestError | null;
  };
};

export const FeaturedCarSection = ({
  featuredCars,
}: FeaturedCarsSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    watchDrag: true,
    containScroll: 'trimSnaps',
  });

  const { PrevButton, NextButton } = usePrevNextCarouselFunctions(emblaApi);

  const { data: cars } = featuredCars;

  return (
    <>
      <Box paddingY="lg">
        <Typography as="h3" variant="h2" align="center">
          Featured cars for sale
        </Typography>
      </Box>

      <Container bg="greyLight" paddingY="lg" paddingX="md">
        <Box
          maxWidth={{ sm: 'pageSm', md: 'pageMd', lg: 'pageLg', xl: 'pageXl' }}
          marginX="auto"
        >
          <Box display="none">
            <Filter />
          </Box>

          <FeaturedCarCarouselContainer>
            <CorouselViewport ref={emblaRef}>
              <Flex gap="lg">
                {cars?.map((car, index) => (
                  <CarPreviewCard key={index} car={car} isRental={false} />
                ))}
              </Flex>
            </CorouselViewport>

            <Flex justifyContent="center" gap="lg" paddingY="lg">
              <PrevButton />
              <NextButton />
            </Flex>
          </FeaturedCarCarouselContainer>

          <Typography
            variant="h4"
            weight="bold"
            hoverEffect="color"
            align="center"
          >
            <Link href="/cars/sales/">View more cars for sale</Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};
