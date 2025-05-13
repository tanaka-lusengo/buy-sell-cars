import Image from 'next/image';
import { Grid, VStack } from '@/styled-system/jsx';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
      height="100vh"
      overflow="hidden"
      position="relative"
    >
      <VStack
        height="100vh"
        maxHeight="100vh"
        overflowY="auto"
        paddingX="lg"
        justifyContent={{ base: 'normal', md: 'center' }}
      >
        {children}
      </VStack>

      <Image
        src="/images/car-headlight.png"
        alt="Red car headlight"
        objectFit="cover"
        priority
        fill
        style={{ zIndex: -1 }}
      />
    </Grid>
  );
};
