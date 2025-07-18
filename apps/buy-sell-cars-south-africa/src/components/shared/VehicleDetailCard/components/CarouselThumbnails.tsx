import { EmblaViewportRefType } from "embla-carousel-react";
import Image from "next/image";
import { StorageBucket, VehicleWithImage } from "@/src/types";
import { Box, Flex } from "@/styled-system/jsx";

type CarouselThumbnailProps = {
  emblaThumbsRef: EmblaViewportRefType;
  vehicle: VehicleWithImage;
  onThumbClick: (index: number) => void;
  selectedIndex: number;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const CarouselThumbnails = ({
  emblaThumbsRef,
  vehicle,
  onThumbClick,
  selectedIndex,
  getPublicUrl,
}: CarouselThumbnailProps) => {
  return (
    <Box
      display={{ base: "none", sm: "block" }}
      width={{ base: "29rem", sm: "55rem", md: "65rem" }}
      paddingY="sm"
    >
      <Box overflow="hidden">
        <Box ref={emblaThumbsRef}>
          <Flex gap="xs">
            {vehicle.images.map((src, index) => (
              <button key={index} onClick={() => onThumbClick(index)}>
                <Box
                  position="relative"
                  cursor="pointer"
                  width="20rem"
                  height="15rem"
                  borderRadius="8px"
                  overflow="hidden"
                  border="3px solid"
                  borderColor={
                    index === selectedIndex ? "primaryDark" : "transparent"
                  }
                >
                  <Image
                    src={getPublicUrl("vehicle-images", src.image_path)}
                    alt={`Image thumbnail ${index + 1}`}
                    title="Thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    quality={70}
                  />
                </Box>
              </button>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
