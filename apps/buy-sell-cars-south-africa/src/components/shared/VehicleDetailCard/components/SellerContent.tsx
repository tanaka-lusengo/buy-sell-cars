"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Typography } from "@/src/components/ui";
import { Profile, VehicleWithImage } from "@/src/types";
import { formatPhoneNumberToZimCountryCode } from "@/src/utils";
import { HStack, VStack } from "@/styled-system/jsx";
import { BASE_URL } from "@/src/constants/environments";

type SellerContentProps = {
  vehicle?: VehicleWithImage;
  owner: Profile | null;
};

export const SellerContent = ({ vehicle, owner }: SellerContentProps) => {
  const pathname = usePathname();

  const vehicleUrl = `${BASE_URL}${pathname}`;

  const formatedNumber = useMemo(
    () => formatPhoneNumberToZimCountryCode(owner?.phone),
    [owner?.phone]
  );

  const listingCategory =
    vehicle?.listing_category === "rental" ? "rent" : "sale";

  const hasDealershipName =
    typeof owner?.dealership_name === "string" &&
    owner.dealership_name.trim().length > 0;

  const whatsappMessage =
    owner && vehicle
      ? `Hello ${owner.first_name},\n\nI'm interested in ${hasDealershipName ? `${owner.dealership_name} and` : ""} your vehicle ${vehicle.make} ${vehicle.model} for ${listingCategory} found on Buy Sell Cars!\n\n Vehicle: ${vehicleUrl}\n\nWhat are next steps?`
      : `Hello,\n\nI'm interested in your vehicle I saw on Buy Sell Cars!\n\nWhat are next steps?`;

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
