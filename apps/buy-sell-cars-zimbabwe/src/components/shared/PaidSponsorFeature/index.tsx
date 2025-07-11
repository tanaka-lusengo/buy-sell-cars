"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ResponsiveContainer, Typography } from "~bsc-shared/ui";
import { Box, Flex } from "@/styled-system/jsx";
import { trackPostHogEvent } from "../../Analytics";

type PaidSponsorFeatureProps = {
  href: string;
  imgSrc: StaticImageData | string;
  imgAlt: string;
  name: string;
  placement: string;
  showHeading?: boolean;
  headingText?: string;
};

export const PaidSponsorFeature = ({
  href,
  imgSrc,
  imgAlt,
  name,
  placement,
  showHeading = false,
  headingText = "Our Partners",
}: PaidSponsorFeatureProps) => {
  return (
    <Box paddingY="lg">
      <ResponsiveContainer>
        {showHeading && (
          <Box paddingBottom="md">
            <Typography variant="h4" align="center">
              {headingText}
            </Typography>
          </Box>
        )}

        <Link
          href={href}
          onClick={() =>
            trackPostHogEvent({
              event: "sponsor_ad_click",
              properties: {
                sponsor: name,
                action: "click",
                url: href,
                placement,
              },
            })
          }
          target="_blank"
          rel="noopener noreferrer"
        >
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
