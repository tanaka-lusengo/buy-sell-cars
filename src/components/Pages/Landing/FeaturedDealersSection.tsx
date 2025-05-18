'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '../../ui';
import { Box, Flex } from '@/styled-system/jsx';
import { Profile } from '@/src/types';
import { StatusCode } from '@/src/utils';
import { PostgrestError } from '@supabase/supabase-js';
import {
  FeaturedDealerCarouselContainer,
  CorouselViewport,
} from './common.styled';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { FeaturedDealersCard } from './components';

type FeaturedDealersSectionProps = {
  featuredDealers: {
    data: Profile[] | null;
    status: StatusCode;
    error: string | PostgrestError | null;
  };
};

export const FeaturedDealersSection = ({
  featuredDealers,
}: FeaturedDealersSectionProps) => {
  const [emblaRef] = useEmblaCarousel(
    { align: 'start', loop: true, dragFree: true },
    [AutoScroll({ speed: 0.7, stopOnInteraction: false })]
  );

  const { data: dealers } = featuredDealers;

  return (
    <Box
      marginX="auto"
      paddingX="md"
      pt="md"
      pb="lg"
      width="100%"
      height="100%"
      maxWidth={{ sm: 'pageSm', md: 'pageMd', lg: 'pageLg', xl: 'pageXl' }}
    >
      <Box paddingY="md">
        <Typography as="h4" variant="h2">
          Browse by dealers
        </Typography>
      </Box>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justifyContent="space-between"
        align="center"
        paddingY="lg"
        gap={{ base: 'xs', md: 'xl' }}
      >
        <Link href="/dealers/the-road-boys" passHref>
          <Box
            height="100%"
            width={{ base: '100%', md: '60rem' }}
            borderRadius="1.2rem"
            _hover={{
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            }}
            transition="all 0.3s ease-in-out"
          >
            <Image
              src="/images/sponsors/road-boys-logistics-feature.jpg"
              alt="featured company banner"
              width={600}
              height={200}
              objectFit="cover"
              loading="lazy"
              style={{
                height: '100%',
                borderRadius: '1.2rem',
              }}
            />
          </Box>
        </Link>

        <FeaturedDealerCarouselContainer>
          <CorouselViewport ref={emblaRef}>
            <Flex>
              {dealers?.map((dealer, index) => (
                <FeaturedDealersCard key={index} dealer={dealer} />
              ))}
            </Flex>
          </CorouselViewport>
        </FeaturedDealerCarouselContainer>
      </Flex>

      <Typography variant="h4" weight="bold" hoverEffect="color" align="center">
        <Link href="/dealers/">See all listed dealers</Link>
      </Typography>
    </Box>
  );
};
