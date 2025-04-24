import { Typography } from '@/src/components/ui';
import Image from 'next/image';
import { Container, HStack, VStack } from '@/styled-system/jsx';
import { ResponsiveContainer } from '@/src/components/ui';

const factList = [
  'Launching a new era of digital automotive trading',
  'AI-powered matching for better deals',
  'Secure, transparent, and professional platform',
  'Simple 24/7 Digital Showcase',
];

export const HeroBanner = () => {
  return (
    <Container px="0" marginX="auto" position="relative" minHeight="65vh">
      <Image
        src="/hero.jpg"
        alt="Hero Image"
        priority
        fill
        sizes="100vw"
        style={{
          position: 'absolute',
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />

      <ResponsiveContainer>
        <Container px="0" zIndex={10} position="absolute" bottom="lg">
          <Container px="0" maxWidth="lg" paddingBottom="md">
            <VStack gap="md" alignItems="normal" maxWidth={{ sm: '85%' }}>
              <Typography
                variant="h1"
                font="heading"
                weight="bold"
                color="primary"
              >
                ZIMBABWE&#39;S PREMIER VEHICLE MARKETPLACE
              </Typography>
              <Typography
                variant="h2"
                font="heading"
                weight="bold"
                color="secondary"
              >
                Revolutionizing How Zimbabwe Buys and Sells Vehicles
              </Typography>

              {factList.map((fact, index) => (
                <HStack key={index} alignItems="flex-start">
                  <Image
                    src="/green-check-icon.svg"
                    alt="Green Check Icon"
                    width={24}
                    height={24}
                    style={{ height: 'auto' }}
                  />
                  <Typography color="secondary">{fact}</Typography>
                </HStack>
              ))}
            </VStack>
          </Container>
        </Container>
      </ResponsiveContainer>
    </Container>
  );
};
