"use client";

import Link from "next/link";
import { useState, useEffect, JSX } from "react";
import { SignOut } from "@/src/components/Pages";
import { Box, Divider, Flex, VStack } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";
import { NavDrawer, NavList, Overlay } from "./index.styled";
import { Bar, BarWrapper, Button } from "./index.styled";
import { usePathname } from "next/navigation";

export const HamburgerMenu = ({
  navLinks,
}: {
  navLinks: {
    href: string;
    icon: JSX.Element;
    label: string;
  }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Flex justifyContent="flex-start" align="center" gap="md">
                  <Box width="1.5rem">{item.icon}</Box>
                  <Typography
                    as="span"
                    weight={pathname === item.href ? "bold" : "normal"}
                    color={pathname === item.href ? "primaryDark" : "text"}
                    hoverEffect="color"
                  >
                    {item.label}
                  </Typography>
                </Flex>
              </Link>
            ))}

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
