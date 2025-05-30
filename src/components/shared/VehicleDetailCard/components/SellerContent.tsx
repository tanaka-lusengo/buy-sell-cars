import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Typography } from "@/src/components/ui";
import { Profile, StorageBucket, VehicleWithImage } from "@/src/types";
import {
  formatPhoneNumberToZimCountryCode,
  formatPriceToDollars,
} from "@/src/utils";
import { Box, Flex, HStack, VStack } from "@/styled-system/jsx";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";

type VehicleTitleProps = {
  vehicle: VehicleWithImage;
  flexDirection?: "row" | "column";
};

export const VehicleTitle = ({
  vehicle,
  flexDirection = "column",
}: VehicleTitleProps) => {
  const vehiclePrice = useMemo(
    () => formatPriceToDollars(vehicle.price),
    [vehicle.price]
  );

  const isRental = vehicle.listing_category === "rental";

  return (
    <Flex
      direction={{ base: "column", md: flexDirection }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent={flexDirection === "row" ? "space-between" : "flex-start"}
    >
      <Typography variant="h3">
        {vehicle.make}, {vehicle.model} {vehicle.year}
      </Typography>
      <Typography variant="h3" color="primaryDark">
        {vehiclePrice}{" "}
        {isRental ? (
          <Typography as="span" variant="h4">
            / per day
          </Typography>
        ) : (
          ""
        )}
      </Typography>
    </Flex>
  );
};

type SellerImageProps = {
  owner: Profile | null;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const SellerImage = ({ owner, getPublicUrl }: SellerImageProps) => {
  return (
    <Link href={`/dealers/${owner?.id}`}>
      <VStack
        _hover={{ opacity: "0.9" }}
        transition="0.2s ease-in-out"
        alignItems="center"
      >
        <Box
          position="relative"
          width={{ base: "25rem", md: "30rem" }}
          height={{ base: "25rem", md: "30rem" }}
          overflow="hidden"
          borderRadius="8px"
        >
          <Image
            src={getPublicUrl("profile-logos", owner?.profile_logo_path ?? "")}
            alt={`${owner?.dealership_name} logo`}
            fill
            objectFit="cover"
            objectPosition="center"
            style={{
              objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                String(owner?.dealership_name)
              )
                ? "contain"
                : "cover",
            }}
          />
        </Box>
        <Typography variant="h4">{owner?.dealership_name}</Typography>
      </VStack>
    </Link>
  );
};

type SellerContentProps = {
  vehicle?: VehicleWithImage;
  owner: Profile | null;
};

export const SellerContent = ({ vehicle, owner }: SellerContentProps) => {
  const formatedNumber = useMemo(
    () => formatPhoneNumberToZimCountryCode(owner?.phone),
    [owner?.phone]
  );

  const listingCategory =
    vehicle?.listing_category === "rental" ? "rent" : "sale";

  const whatsappMessage =
    owner && vehicle
      ? `Hello ${owner.first_name},\n\nI'm interested in ${owner.dealership_name} and your vehicle ${vehicle.make} ${vehicle.model} for ${listingCategory}!\n\nWhat are next steps?`
      : `Hello,\n\nI'm interested in your vehicle!\n\nWhat are next steps?`;

  return (
    <VStack alignItems="flex-start">
      <Typography variant="h3" weight="bold">
        Contact seller
      </Typography>

      <Typography variant="h4">
        {owner?.first_name} {owner?.last_name}
      </Typography>

      <Link
        href={`https://wa.me/${formatedNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <HStack
          borderBottom={"1.5px solid"}
          borderColor="transparent"
          _hover={{
            borderColor: "green",
            transition: "0.3s ease-in-out",
          }}
        >
          <i
            className="fa-brands fa-whatsapp fa-lg"
            aria-hidden="true"
            title="whatsapp"
            style={{
              color: "green",
            }}
          ></i>
          <Typography color="green" weight="bold">
            WhatsApp seller
          </Typography>
        </HStack>
      </Link>

      <Link
        href={`tel:${formatedNumber}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <HStack
          borderBottom={"1.5px solid"}
          borderColor="transparent"
          _hover={{
            borderColor: "primary",
            transition: "0.3s ease-in-out",
          }}
        >
          <i className="fa-solid fa-phone" aria-hidden="true" title="phone"></i>
          <Typography>{formatedNumber}</Typography>
        </HStack>
      </Link>
      <Link
        href={`mailto:${owner?.email}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <HStack
          borderBottom={"1.5px solid"}
          borderColor="transparent"
          _hover={{
            borderColor: "primary",
            transition: "0.2s ease-in-out",
          }}
        >
          <i
            className="fa-solid fa-envelope"
            aria-hidden="true"
            title="email"
          ></i>
          <Typography>{owner?.email}</Typography>
        </HStack>
      </Link>
      <HStack>
        <i
          className="fa-solid fa-location-dot"
          aria-hidden="true"
          title="location"
        ></i>
        <Typography>
          {owner?.address} {vehicle?.location} Zimbabwe
        </Typography>
      </HStack>
    </VStack>
  );
};
