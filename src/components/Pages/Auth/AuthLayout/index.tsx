import Image from 'next/image';
import { Grid } from '@/styled-system/jsx';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
      padding="md"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {children}

      <Image
        src="/images/car-headlight.png"
        alt="Red car headlight"
        objectFit="cover"
        priority
        fill
        style={{
          zIndex: -1,
        }}
      />
    </Grid>
  );
};
