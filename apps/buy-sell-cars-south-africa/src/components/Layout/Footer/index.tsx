"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { InputField } from "~bsc-shared/components/FormComponents";
import { Typography, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
} from "~bsc-shared/utils";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { useAuth } from "@/src/context/auth-context";
import { subscribeValidationSchema } from "@/src/schemas";
import { subscribe } from "@/src/server/actions/auth";
import { SubscribeFormType } from "@/src/types";
import { Box, Flex, Grid, HStack } from "@/styled-system/jsx";
import { SocialMediaLink } from "../../shared";
import { FooterContainer, FooterContent, FooterLink } from "./index.styled";

export const Footer = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeFormType>({
    resolver: zodResolver(subscribeValidationSchema),
    mode: "all",
    defaultValues: { email: "" },
  });

  const handleAction = async (formData: SubscribeFormType) => {
    try {
      const { status, error } = await subscribe(formData);

      if (status !== StatusCode.SUCCESS) {
        return handleClientError("subscribing", error);
      }

      setIsSuccess(true);
      toastNotifySuccess("Subscribed to newsletter successfully!");
    } catch (error) {
      handleClientError("subscribing", error);
    }
  };

  const isHomePage = pathname === "/";
  const isDashboardPage = pathname.startsWith("/dashboard");

  const showGreyBackground =
    isHomePage || isDashboardPage ? "greyLight" : "white";

  return (
    <FooterContainer bg={showGreyBackground ? "greyLight" : "white"}>
      <FooterContent>
        <Link href="/">
          <Image
            src="/logo/buy-sell-cars-logo.png"
            alt="Buy Sell Cars logo"
            width={65}
            height={65}
            priority
            sizes="100vw"
            style={{ height: "auto", padding: "0.1rem 0" }}
            quality={70}
          />
        </Link>

        <Box mb="lg">
          <Typography variant="h3">Buy Sell Cars SA</Typography>
          <Typography variant="body2">
            Your trusted car marketplace in South Africa
          </Typography>
        </Box>

        <Grid
          gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={{ base: "xxs", md: "lg" }}
        >
          {/* Block 1 */}
          <Flex direction="column" mb="lg">
            <Typography variant="h3">Find Your Vehicle</Typography>

            <FooterLink href="/cars/sales/">Car sales</FooterLink>
            <FooterLink href="/trucks/sales/">Truck sales</FooterLink>
            <FooterLink href="/bikes/sales/">Bike sales</FooterLink>
            <FooterLink href="/agriculture/sales/">
              Agriculture machinery sales
            </FooterLink>
            <FooterLink href="/earth-moving/sales/">
              Earth-moving machinery sales
            </FooterLink>
          </Flex>

          {/* Bock 2 */}
          <Flex direction="column" mb="lg">
            <Typography variant="h3">Sell Your Vehicle</Typography>

            <FooterLink href={user ? "/dashboard/add-listing" : "/sign-up"}>
              Post your car ad
            </FooterLink>
            <FooterLink href={user ? "/dashboard/" : "/sign-in/"}>
              {user
                ? "Manage your listings"
                : "Sign in to manage your listings"}
            </FooterLink>
          </Flex>

          {/* Block 3 */}
          <Flex direction="column" mb="lg">
            <Typography variant="h3">Contact Us</Typography>
            <Link
              href={SOCIAL_MEDIA_URLS.phone_whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack
                _hover={{
                  color: "green",
                  transition: "0.3s ease-in-out",
                }}
              >
                <i
                  className="fa-brands fa-whatsapp"
                  aria-hidden="true"
                  title="whatsapp"
                  style={{ width: "2rem" }}
                ></i>
                <Typography variant="body2">WhatsApp</Typography>
              </HStack>
            </Link>

            <Link
              href={SOCIAL_MEDIA_URLS.phone_tel}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack
                _hover={{
                  color: "primary",
                  transition: "0.3s ease-in-out",
                }}
              >
                <i
                  className="fa-solid fa-phone"
                  aria-hidden="true"
                  title="phone"
                  style={{ width: "2rem" }}
                ></i>
                <Typography variant="body2">
                  {SOCIAL_MEDIA_URLS.phone}
                </Typography>
              </HStack>
            </Link>

            <Link
              href={`${SOCIAL_MEDIA_URLS.email}?subject=General%20Enquiry`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack
                _hover={{
                  color: "primary",
                  transition: "0.3s ease-in-out",
                }}
              >
                <i
                  className="fa-solid fa-envelope"
                  aria-hidden="true"
                  title="email"
                  style={{ width: "2rem" }}
                ></i>
                <Typography variant="body2">
                  {SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}
                </Typography>
              </HStack>
            </Link>

            <Link href="/faqs">
              <HStack
                _hover={{
                  color: "primary",
                  transition: "0.3s ease-in-out",
                }}
              >
                <i
                  className="fa-solid fa-question"
                  aria-hidden="true"
                  title="FAQs"
                  style={{ width: "2rem" }}
                ></i>
                <Typography variant="body2">FAQs</Typography>
              </HStack>
            </Link>

            <HStack>
              <i
                className="fa-solid fa-location-dot"
                aria-hidden="true"
                title="location"
                style={{ width: "2rem" }}
              ></i>
              <Typography variant="body2">South Africa</Typography>
            </HStack>
          </Flex>

          {/* Block 4 */}
          <Flex direction="column" mb="lg">
            <Typography variant="h3">Follow Us</Typography>

            <HStack paddingY="md">
              <SocialMediaLink
                type="instagram"
                href={SOCIAL_MEDIA_URLS.instagram}
              />

              <SocialMediaLink
                type="square-facebook"
                href={SOCIAL_MEDIA_URLS.facebook}
              />
            </HStack>
          </Flex>
        </Grid>

        <Flex direction="column" mb="lg">
          <form
            onSubmit={handleSubmit(
              async (formValues: SubscribeFormType) =>
                await handleAction(formValues)
            )}
          >
            <Typography align="center">Subscribe to our newsletter</Typography>
            <HStack justifyContent="center" alignItems="flex-start" mt="sm">
              {isSuccess ? (
                <Typography color="primaryDark">
                  Thank you for subscribing! Check your email for future
                  updates.
                </Typography>
              ) : (
                <>
                  <Box>
                    <InputField
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      register={register}
                      errors={errors}
                    />
                  </Box>

                  <Button type="submit">Subscribe</Button>
                </>
              )}
            </HStack>
          </form>
        </Flex>

        <Typography align="center">
          © 2024 Buy Sell Cars. All rights reserved.
        </Typography>
      </FooterContent>
    </FooterContainer>
  );
};
