"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputField } from "~bsc-shared/components";
import { Button, Typography } from "~bsc-shared/ui";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
} from "~bsc-shared/utils";
import { useAuth } from "@/src/context/auth-context";
import { subscribeValidationSchema } from "@/src/schemas";
import { subscribe, hasAlreadySubscribed } from "@/src/server/actions/auth";
import { SubscribeFormType } from "@/src/types";
import { Box, Flex, VStack } from "@/styled-system/jsx";

export const SubscribeModal = () => {
  const { profile } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeFormType>({
    resolver: zodResolver(subscribeValidationSchema),
    mode: "all",
    defaultValues: { email: "" },
  });

  const handleHasAlreadySubscribed = async (email: string) => {
    try {
      const { hasSubscribed } = await hasAlreadySubscribed(email);

      if (hasSubscribed) {
        localStorage.setItem("userSubscribed", "true");
      } else {
        localStorage.setItem("userSubscribed", "false");
      }
    } catch (error) {
      console.error("checking subscription status", error);
    }
  };

  useEffect(() => {
    const checkAndMaybeShowModal = async () => {
      if (profile) {
        await handleHasAlreadySubscribed(profile.email);
      }

      const lastShown = localStorage.getItem("subscribeModalLastShown");
      const dismissedCount = parseInt(
        localStorage.getItem("subscribeModalDismissedCount") || "0",
        10
      );
      const subscribed = localStorage.getItem("userSubscribed") === "true";

      const now = new Date().getTime();
      const oneWeek = 1000 * 60 * 60 * 24 * 7;

      const shouldShow =
        !subscribed &&
        (lastShown === null || now - parseInt(lastShown) > oneWeek) &&
        dismissedCount < 3;

      const timer = setTimeout(() => {
        if (shouldShow) {
          setIsOpen(true);
          setTimeout(() => setShowAnimation(true), 10);
          localStorage.setItem("subscribeModalLastShown", now.toString());
        }
      }, 5000);

      return () => clearTimeout(timer);
    };

    checkAndMaybeShowModal();
  }, [profile]);

  const handleAction = async (formData: SubscribeFormType) => {
    try {
      const { status, error } = await subscribe(formData);

      if (status !== StatusCode.SUCCESS) {
        return handleClientError("subscribing", error);
      }

      localStorage.setItem("userSubscribed", "true");

      setIsSuccess(true);
      toastNotifySuccess("Subscribed to newsletter successfully!");
      setIsOpen(false);
    } catch (error) {
      handleClientError("subscribing", error);
    }
  };

  const handleDismiss = () => {
    const dismissedCount = parseInt(
      localStorage.getItem("subscribeModalDismissedCount") || "0",
      10
    );

    localStorage.setItem(
      "subscribeModalDismissedCount",
      (dismissedCount + 1).toString()
    );

    setShowAnimation(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      backgroundGradient="linear-gradient(rgba(30, 39, 55, 0.65), rgba(30, 39, 55, 0.65))"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="50"
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
        maxWidth="60rem"
        style={{
          transform: showAnimation ? "scale(1)" : "scale(0.95)",
          opacity: showAnimation ? 1 : 0,
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <form
          onSubmit={handleSubmit(
            async (formValues: SubscribeFormType) =>
              await handleAction(formValues)
          )}
        >
          <VStack alignItems="flex-start" gap="sm">
            <Typography variant="h4" weight="bold">
              Join our newsletter
            </Typography>
            <Typography>
              Get updates, car listings, and tips right in your inbox.
            </Typography>

            {isSuccess ? (
              <Typography>
                Thank you for subscribing! Check your email for future updates.
              </Typography>
            ) : (
              <>
                <Box marginY="md" width="100%">
                  <InputField
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    register={register}
                    errors={errors}
                  />
                </Box>

                <Flex gap="md" alignItems="center">
                  <Button variant="ghost" onClick={handleDismiss}>
                    No thanks
                  </Button>
                  <Button type="submit">Subscribe</Button>
                </Flex>
              </>
            )}

            <Box marginTop="lg">
              <Typography variant="body2" align="center">
                <i>
                  By subscribing, you agree to receive emails from us. You can
                  unsubscribe at any time.
                </i>
              </Typography>
            </Box>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};
