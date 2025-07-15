"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { trackPostHogEvent, useTrackOnView } from "@/src/components/Analytics";
import { Box, Flex } from "@/styled-system/jsx";

type BannerSlideProps = {
  href: string;
  src: string | StaticImageData;
  alt: string;
  name: string;
};

export const BannerSlide = ({ href, src, alt, name }: BannerSlideProps) => {
  const ref = useRef(null);

  useTrackOnView(ref, () =>
    trackPostHogEvent({
      event: "sponsor_ad_view",
      properties: {
        sponsor: name,
        action: "view",
        url: href,
        placement: "landing_page_banner_bottom",
      },
    })
  );

  return (
    <Link
      href={href}
      onClick={() =>
        trackPostHogEvent({
          event: "sponsor_ad_click",
          properties: {
            sponsor: name,
            action: "click",
            url: href,
            placement: "landing_page_banner_bottom",
          },
        })
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box width="100%" ref={ref}>
        <Flex
          marginX="auto"
          justifyItems="center"
          width={{ base: "100%", xl: "90rem" }}
          borderRadius="1.2rem"
          transition="all 0.3s ease-in-out"
          _hover={{
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
          }}
          overflow="hidden"
          aspectRatio="16/9"
        >
          <Image
            src={src}
            alt={alt}
            loading="lazy"
            width={1600}
            height={900}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "1.2rem",
            }}
            quality={70}
            sizes="(max-width: 1280px) 100vw, 80rem"
          />
        </Flex>
      </Box>
    </Link>
  );
};
