"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography } from "~bsc-shared/ui";
import { SignOut } from "@/src/components/Pages";
import { useAuth } from "@/src/context/auth-context";
import { Divider, VStack } from "@/styled-system/jsx";
import { navLinksMap } from "../../constants";
import { stripTrailingSlash } from "../../utils/helpers";
import { NavDrawer, NavList, SubNavList, Overlay } from "./index.styled";
import { Bar, BarWrapper, Button } from "./index.styled";

type HanburgerMenuProps = {
  navLinks: { label: string; href: string }[];
  subNavLinks: { label: string; href: string }[];
};

export const HamburgerMenu = ({
  navLinks,
  subNavLinks,
}: HanburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const basePaths = Object.keys(navLinksMap).sort(
    (a, b) => b.length - a.length
  );

  const matchingBasePath = basePaths.find((basePath) =>
    stripTrailingSlash(pathname).startsWith(stripTrailingSlash(basePath))
  );

  const isMatchingPath = (path: string, label: string) =>
    path === matchingBasePath || (label === "Cars" && pathname === "/");

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
        <VStack gap="sm" alignItems="flex-start">
          <VStack
            marginTop="lg"
            display={{ base: "flex", xxl: "none" }}
            alignItems="flex-start"
          >
            <Typography variant="h4" weight="bold" hoverEffect="color">
              <Link
                href={user ? "/dashboard/add-listing" : "/sign-up"}
                onClick={() => setIsOpen(false)}
              >
                Sell Your Vehicle
              </Link>
            </Typography>
            <Typography variant="h4" weight="bold" hoverEffect="color">
              <Link
                href={`${user ? "/dashboard" : "/sign-in"}`}
                onClick={() => setIsOpen(false)}
              >
                {user ? "Account" : "Login"}
              </Link>
            </Typography>
            {user && <SignOut showIcon={false} />}
          </VStack>

          <Divider width="100%" marginY="md" color="grey" />

          <SubNavList>
            {subNavLinks.map((item) => (
              <li key={item.label}>
                <Typography
                  as="span"
                  style={{ fontSize: "1.6rem" }}
                  weight={
                    isMatchingPath(item.href, item.label) ? "bold" : "normal"
                  }
                  color={
                    isMatchingPath(item.href, item.label)
                      ? "primaryDark"
                      : "text"
                  }
                  hoverEffect="color"
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </Typography>
              </li>
            ))}
          </SubNavList>

          <NavList>
            {navLinks.map((item) => (
              <li key={item.label}>
                <Typography
                  as="span"
                  color="primary"
                  hoverEffect="color"
                  weight="bold"
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </Typography>
              </li>
            ))}
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
