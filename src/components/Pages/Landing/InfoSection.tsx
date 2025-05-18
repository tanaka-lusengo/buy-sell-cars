'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, ResponsiveContainer, Typography } from '@/src/components/ui';
import { Grid, HStack, VStack, Divider, Container } from '@/styled-system/jsx';
import { useAuth } from '@/src/context/auth-context';

const factListLeft = [
  'Instant Exposure to Quality Buyers',
  'Simple 3-Step Listing Process',
  '24/7 Digital Showcase',
];

const factListRight = [
  'First-To-Market Premium Platform',
  'Unlimited Premium Listings',
  'Priority Support & Consultation',
];

export const InfoSection = () => {
  const { user } = useAuth();
  const { push } = useRouter();

  const handleOnClick = () => {
    if (user) {
      push('/dashboard/add-listing');
    } else {
      push('/sign-up');
    }
  };

  return (
    <Container backgroundColor="greyLight" paddingY="sm">
      <ResponsiveContainer>
        <Grid
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          gap="lg"
          maxWidth={{ base: '100%', xl: 'pageLg' }}
          marginX="auto"
          width="100%"
          marginY="lg"
        >
          {/* LHS */}
          <Container width={{ base: '100%', md: '295px', lg: '400px' }}>
            <VStack alignItems="center" gap="md">
              <Typography variant="h2" align="center">
                Sell your car
              </Typography>

              {factListLeft.map((fact, index) => (
                <HStack key={index} alignItems="flex-start">
                  <Image
                    src="/green-check-icon.svg"
                    alt="Green Check Icon"
                    width={24}
                    height={24}
                    style={{ height: 'auto' }}
                  />
                  <div style={{ width: '281px' }}>
                    <Typography>{fact}</Typography>
                  </div>
                </HStack>
              ))}
              <Button onClick={handleOnClick}>Post your ad</Button>
            </VStack>
          </Container>

          {/* Divider with "Or" */}
          <HStack alignItems="center" justifyContent="center" marginY="lg">
            <Divider flex="1" borderColor="grey" />
            <Typography variant="h4">Or</Typography>
            <Divider flex="1" borderColor="grey" />
          </HStack>

          {/* RHS */}
          <Container width={{ base: '100%', md: '295px', lg: '400px' }}>
            <VStack alignItems="center" gap="md">
              <Typography variant="h2" align="center">
                Elevate your dealership
              </Typography>

              {factListRight.map((fact, index) => (
                <HStack key={index} alignItems="flex-start">
                  <Image
                    src="/green-check-icon.svg"
                    alt="Green Check Icon"
                    width={24}
                    height={24}
                    style={{ height: 'auto' }}
                  />
                  <div style={{ width: '251px' }}>
                    <Typography>{fact}</Typography>
                  </div>
                </HStack>
              ))}
              <Button onClick={handleOnClick}>Sell your vehicle</Button>
            </VStack>
          </Container>
        </Grid>
      </ResponsiveContainer>
    </Container>
  );
};
