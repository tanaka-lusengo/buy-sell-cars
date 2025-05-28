"use client";

import { useState, useEffect } from "react";
import { SignOut } from "@/src/components/Pages";
import { NavLinksDashboard } from "../NavLinksDashboard";
import { Divider, VStack } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import {
  NavDrawer,
  NavList,
  Overlay,
  Bar,
  BarWrapper,
  Button,
} from "./index.styled";

export const HamburgerMenu = ({ pathname }: { pathname: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <BarWrapper>
          <Bar position="top" isOpen={isOpen} />
          <Bar position="middle" isOpen={isOpen} />
          <Bar position="bottom" isOpen={isOpen} />
        </BarWrapper>
      </Button>

      {/* Navigation Drawer */}
      <NavDrawer isOpen={isOpen}>
        <VStack gap="md" alignItems="flex-start">
          <VStack marginTop="lg" alignItems="flex-start">
            <Typography variant="h4" weight="bold">
              Settings
            </Typography>
          </VStack>

          <Divider marginY="sm" display={{ base: "block", md: "none" }} />

          <NavList>
            {/* Render different navigation links based on verification status */}
            <NavLinksDashboard pathname={pathname} />

            <Divider width="15rem" marginY="sm" color="grey" />

            <SignOut />
          </NavList>
        </VStack>
      </NavDrawer>

      {/* Overlay */}
      {isOpen && (
        <Overlay
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(false);
            }
          }}
        />
      )}
    </>
  );
};
