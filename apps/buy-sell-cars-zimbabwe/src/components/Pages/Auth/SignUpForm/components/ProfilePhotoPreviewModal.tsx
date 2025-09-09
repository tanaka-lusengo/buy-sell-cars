"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Button, Typography } from "~bsc-shared/ui";
import { Box, Flex, VStack } from "@/styled-system/jsx";

type ProfilePhotoPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  imageFile: File | null;
};

export const ProfilePhotoPreviewModal = ({
  isOpen,
  onClose,
  imageSrc,
  imageFile,
}: ProfilePhotoPreviewModalProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      setTimeout(() => setShowAnimation(true), 10);
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <Box
      position="fixed"
      inset="0"
      bg="rgba(0, 0, 0, 0.75)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
      onClick={handleBackdropClick}
      style={{
        transition: "opacity 0.3s",
        opacity: showAnimation ? 1 : 0,
      }}
    >
      <Box
        bg="white"
        marginX="md"
        padding="lg"
        borderRadius="1.2rem"
        shadow="lg"
        width="100%"
        maxWidth="40rem"
        style={{
          transform: showAnimation ? "scale(1)" : "scale(0.95)",
          opacity: showAnimation ? 1 : 0,
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <VStack alignItems="flex-start" gap="md">
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="h4" weight="bold">
              Profile Photo Preview
            </Typography>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </Flex>

          {imageSrc && imageFile ? (
            <Box width="100%" display="flex" justifyContent="center">
              <Box
                position="relative"
                width="100%"
                maxWidth="300px"
                aspectRatio="1"
                borderRadius="1.2rem"
                overflow="hidden"
                border="1px solid"
                borderColor="grey"
              >
                <Image
                  src={imageSrc}
                  alt="Profile photo preview"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  quality={100}
                />
              </Box>
            </Box>
          ) : (
            <Box
              width="100%"
              height="200px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              border="2px dashed"
              borderColor="grey"
              borderRadius="1.2rem"
              bg="greyLight"
            >
              <Typography color="textLight">No image selected</Typography>
            </Box>
          )}

          {imageFile && (
            <VStack alignItems="flex-start" gap="xs" width="100%">
              <Typography weight="medium">File Details:</Typography>
              <Typography>
                <strong>Name:</strong> {imageFile.name}
              </Typography>
              <Typography>
                <strong>Size:</strong>{" "}
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Typography>
                <strong>Type:</strong> {imageFile.type}
              </Typography>
            </VStack>
          )}

          <Flex
            gap="md"
            alignItems="center"
            width="100%"
            justifyContent="flex-end"
          >
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );

  return createPortal(modalContent, document.body);
};
