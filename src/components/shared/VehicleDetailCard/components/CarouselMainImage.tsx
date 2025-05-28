"use client";

import Image from "next/image";
import { SetStateAction, useState } from "react";
import { Flex, HStack, Box } from "@/styled-system/jsx";
import { EmblaViewportRefType } from "embla-carousel-react";
import { Typography } from "../../../ui";
import { StorageBucket, VehicleWithImage } from "@/src/types";

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
  // State to control modal visibility and which image is shown
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);

  // Function to open modal with selected image
  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setModalOpen(true);
    setSelectedIndex(index); // Optionally keep this if you want to sync carousel
  };

  // Function to close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImageIndex(null);
  };

  return (
    <Box width={{ base: "29rem", sm: "55rem", md: "65rem" }}>
      <Box overflow="hidden" ref={emblaMainRef}>
        <Flex gap={{ base: "sm", sm: "lg" }}>
          {vehicle.images.map((src, index) => (
            <Box
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                handleImageClick(index);
              }}
            >
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

      {/* Modal for enlarged image */}
      {modalOpen && modalImageIndex !== null && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0,0,0,0.8)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          onClick={handleCloseModal}
        >
          {/* Prevent modal from closing when clicking on the image itself */}
          <Box
            position="relative"
            onClick={(e) => e.stopPropagation()}
            borderRadius="1.2rem"
            overflow="hidden"
            boxShadow="lg"
            backgroundColor="white"
          >
            <Image
              src={getPublicUrl(
                "vehicle-images",
                vehicle.images[modalImageIndex].image_path ?? ""
              )}
              alt={`Enlarged Image ${modalImageIndex + 1}`}
              width={900}
              height={600}
              style={{ objectFit: "contain" }}
              onClick={handleCloseModal}
            />
            {/* Close button in the corner */}
            <Box
              position="absolute"
              top="1rem"
              right="1rem"
              cursor="pointer"
              padding="sm"
              onClick={handleCloseModal}
              zIndex="1001"
            >
              <i
                className="fa-solid fa-xmark fa-xl"
                style={{ color: "white" }}
                aria-label="Close"
              ></i>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
