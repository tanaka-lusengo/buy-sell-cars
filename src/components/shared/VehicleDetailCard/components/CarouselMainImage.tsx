import Image from "next/image";
import { Flex, HStack, Box } from "@/styled-system/jsx";
import { EmblaViewportRefType } from "embla-carousel-react";
import { Typography } from "../../../ui";
import { StorageBucket, VehicleWithImage } from "@/src/types";
import { SetStateAction } from "react";

type CarouselMainImageProps = {
  emblaMainRef: EmblaViewportRefType;
  vehicle: VehicleWithImage;
  setSelectedIndex: (value: SetStateAction<number>) => void;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const CarouselMainImage = ({
  emblaMainRef,
  vehicle,
  setSelectedIndex,
  getPublicUrl,
}: CarouselMainImageProps) => {
  return (
    <Box width={{ base: "29rem", sm: "55rem", md: "65rem" }}>
      <Box overflow="hidden" ref={emblaMainRef}>
        <Flex gap={{ base: "sm", sm: "lg" }}>
          {vehicle.images.map((src, index) => (
            <Box key={index} onClick={() => setSelectedIndex(index)}>
              <Box
                position="relative"
                cursor="pointer"
                width={{ base: "29rem", sm: "55rem", md: "65rem" }}
                height={{ base: "30rem", sm: "35rem", md: "45rem" }}
                borderRadius="8px"
                overflow="hidden"
              >
                <Image
                  src={getPublicUrl("vehicle-images", src.image_path ?? "")}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  objectFit="cover"
                  objectPosition="center"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  right="0"
                  margin="sm"
                  padding="sm"
                  borderRadius="8px"
                  backgroundColor="black"
                  opacity="0.8"
                >
                  <HStack>
                    <i
                      className="fa-solid fa-camera"
                      aria-hidden="true"
                      title="camera"
                      style={{
                        color: "white",
                      }}
                    ></i>
                    <Typography color="white" weight="bold">
                      {index + 1} / {vehicle.images.length}
                    </Typography>
                  </HStack>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
