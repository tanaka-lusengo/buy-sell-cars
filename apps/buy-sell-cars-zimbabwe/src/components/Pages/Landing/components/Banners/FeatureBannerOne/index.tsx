"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWindowSize } from "~bsc-shared/hooks";
import rossiTyresDesktop from "@/public/images/sponsors/rossi/rossi-tyres-lg.jpg";
import rossiTyresMobile from "@/public/images/sponsors/rossi/rossi-tyres-sm.jpg";
import { trackPostHogEvent, useTrackOnView } from "@/src/components/Analytics";
import { SPONSOR_NAMES } from "@/src/constants/sponsors";
import { EXTERNAL_URLS } from "@/src/constants/urls";
import { breakpointsNumber } from "@/src/styles";
import { Box, Flex } from "@/styled-system/jsx";

export const FeatureBannerOne = () => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < breakpointsNumber.md;

  const ref = useRef(null);

  useTrackOnView(ref, () =>
    trackPostHogEvent({
      event: "sponsor_ad_view",
      properties: {
        sponsor: SPONSOR_NAMES.ROSSI_TYRES,
        action: "view",
        url: EXTERNAL_URLS.ROSSI_TYRES_URL,
        placement: "landing_page_banner_middle",
      },
    })
  );

  return (
    <Link
      href={EXTERNAL_URLS.ROSSI_TYRES_URL}
      onClick={() =>
        trackPostHogEvent({
          event: "sponsor_ad_click",
          properties: {
            sponsor: SPONSOR_NAMES.ROSSI_TYRES,
            action: "click",
            url: EXTERNAL_URLS.ROSSI_TYRES_URL,
            placement: "landing_page_banner_middle",
          },
        })
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box bg="greyLight" padding="md" width="100%" ref={ref}>
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
            src={isMobile ? rossiTyresMobile : rossiTyresDesktop}
            alt="Rossi Tyres Harrare Drive Zimbabwe"
            loading="lazy"
            width={1600}
            height={900}
            style={{
              objectFit: "cover",
              width: "100%",
              borderRadius: "1.2rem",
            }}
            quality={70}
          />
        </Flex>
      </Box>
    </Link>
  );
};
