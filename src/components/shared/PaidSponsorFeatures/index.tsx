import Link from "next/link";
import Image from "next/image";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { Box, Flex } from "@/styled-system/jsx";
import { ResponsiveContainer, Typography } from "@/src/components/ui";

export const PaidSponsorFeature = () => {
  return (
    <Box paddingY="lg" bg="white">
      <ResponsiveContainer>
        <Box paddingBottom="md">
          <Typography variant="h4" align="center">
            Our Partners
          </Typography>
        </Box>

        <Link
          href={EXTERNAL_URLS.ROAD_BOYS_LOGISTICS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Flex
            marginX="auto"
            height="100%"
            justifyItems="center"
            width={{ base: "100%", md: "55rem" }}
            borderRadius="1.2rem"
            _hover={{
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            }}
            transition="all 0.3s ease-in-out"
          >
            <Image
              src="/images/sponsors/road-boys-logistics.jpg"
              alt="Road boys logistics Zimbabwe"
              objectFit="cover"
              loading="lazy"
              height={1100}
              width={1000}
              style={{
                width: "100%",
                borderRadius: "1.2rem",
              }}
            />
          </Flex>
        </Link>
      </ResponsiveContainer>
    </Box>
  );
};
