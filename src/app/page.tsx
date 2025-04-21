import { Typography } from '@/src/components/ui';
import Image from 'next/image';
import { Container, HStack, VStack } from '@/styled-system/jsx';

const factList = [
  'Launching new era of digital automotive trading',
  'AI-powered matching for better deals',
  'Secure, transparent, and professional platform',
  'Simple 24/7 Digital Showcase',
];

export default function Home() {
  return (
    <Container marginX="auto" position="relative" minHeight="65vh">
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

      <Container zIndex={10} position="absolute" paddingX="md" bottom={0}>
        <Container maxWidth="lg" paddingBottom="md">
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
                />
                <Typography color="secondary">{fact}</Typography>
              </HStack>
            ))}
          </VStack>
        </Container>
      </Container>
    </Container>
  );
}
