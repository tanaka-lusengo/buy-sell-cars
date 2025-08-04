import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer, H4 } from "~bsc-shared/ui";
import { Box, Flex } from "@/styled-system/jsx";

type PaidSponsorFeatureProps = {
  href: string;
  imgSrc: string;
  imgAlt: string;
  showHeading?: boolean;
  headingText?: string;
};

export const PaidSponsorFeature = ({
  href,
  imgSrc,
  imgAlt,
  showHeading = false,
  headingText = "Our Partners",
}: PaidSponsorFeatureProps) => {
  return (
    <Box paddingY="lg">
      <ResponsiveContainer>
        {showHeading && (
          <Box paddingBottom="md">
            <H4 align="center">{headingText}</H4>
          </Box>
        )}

        <Link href={href} target="_blank" rel="noopener noreferrer">
          <Flex
            marginX="auto"
            height="100%"
            justifyItems="center"
            width={{ base: "100%", xl: "90rem" }}
            borderRadius="1.2rem"
            _hover={{
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            }}
            transition="all 0.3s ease-in-out"
          >
            <Image
              src={imgSrc}
              alt={imgAlt}
              loading="lazy"
              height={1100}
              width={1000}
              style={{
                objectFit: "cover",
                width: "100%",
                borderRadius: "1.2rem",
              }}
              quality={70}
            />
          </Flex>
        </Link>
      </ResponsiveContainer>
    </Box>
  );
};
