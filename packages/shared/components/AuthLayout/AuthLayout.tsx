import Image from "next/image";
import { Box, Grid, VStack } from "../../styled-system/jsx";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box position="relative" height="100vh" overflow="hidden">
      <Image
        src="/images/car-headlight.png"
        alt="Red car headlight"
        fill
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        priority
        quality={70}
      />

      {/* Foreground layout */}
      <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} height="100%">
        <VStack
          height="100vh"
          overflowY="auto"
          paddingX="lg"
          justifyContent={{ base: "normal", md: "center" }}
          zIndex={1}
        >
          {children}
        </VStack>

        {/* Empty right column on large screens */}
        <Box display={{ base: "none", lg: "block" }} />
      </Grid>
    </Box>
  );
};
