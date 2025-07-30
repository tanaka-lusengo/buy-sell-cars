"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { P, PSmall, Typography, ResponsiveContainer } from "~bsc-shared/ui";
import { generateIcon } from "~bsc-shared/utils";
import { useAuth } from "@/src/context/auth-context";
import { Divider, Flex, HStack, Stack } from "@/styled-system/jsx";
import { HamburgerMenu } from "./components/HamburgerMenu";
import { navLinksMap } from "./constants";
import { Header, Nav, NavList, SubNavList } from "./index.styled";
import { stripTrailingSlash } from "./utils/helpers";

type BasePath = keyof typeof navLinksMap;

const AccountIcon = (
  <HStack>
    <P weight="bold">Account</P>
    {generateIcon("user")}
  </HStack>
);

export const Navbar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const basePaths = Object.keys(navLinksMap).sort(
    (a, b) => b.length - a.length
  );

  const matchingBasePath = basePaths.find((basePath) =>
    stripTrailingSlash(pathname).startsWith(stripTrailingSlash(basePath))
  );

  const navLinks = matchingBasePath
    ? navLinksMap[matchingBasePath as BasePath]
    : navLinksMap["/"];

  const subNavLinks = [
    { label: "Cars", href: "/car/sales/" },
    { label: "Trucks", href: "/truck/sales/" },
    { label: "Bikes", href: "/bike/sales/" },
    { label: "Agriculture", href: "/agriculture/sales/" },
    { label: "Earth moving", href: "/earth-moving/sales/" },
  ];

  const isMatchingPath = (path: string, label: string) =>
    path === matchingBasePath || (label === "Cars" && pathname === "/");

  const isSignUpPage = pathname.includes("/sign-up");
  const isSignInPage = pathname.includes("/sign-in");

  if (isSignUpPage || isSignInPage) {
    return null;
  }

  return (
    <Header>
      <ResponsiveContainer>
        <Nav>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            gap="lg"
          >
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

            {/* Desktop Navigation */}
            <NavList>
              {navLinks.map((item) => (
                <li key={item.label}>
                  <P color="primary" hoverEffect="color" weight="bold">
                    <Link href={item.href}>{item.label}</Link>
                  </P>
                </li>
              ))}
            </NavList>
          </Flex>

          <Stack
            display={{ base: "none", lg: "flex" }}
            flexDirection="row"
            gap="md"
          >
            <Typography as="span" hoverEffect="color" weight="bold">
              <Link href={user ? "/dashboard/add-listing" : "/sign-up"}>
                Sell your vehicle
              </Link>
            </Typography>

            <Typography as="span" hoverEffect="color" weight="bold">
              <Link href={`${user ? "/dashboard" : "/sign-in"}`}>
                {user ? AccountIcon : "Login"}
              </Link>
            </Typography>
          </Stack>

          {/* Hamburger Menu Button */}
          <HamburgerMenu navLinks={navLinks} subNavLinks={subNavLinks} />
        </Nav>

        <Divider
          marginY="sm"
          color="grey"
          display={{ base: "none", lg: "block" }}
        />

        <SubNavList>
          {subNavLinks.map((item) => (
            <li key={item.label}>
              <PSmall
                weight={
                  isMatchingPath(item.href, item.label) ? "bold" : "normal"
                }
                color={
                  isMatchingPath(item.href, item.label) ? "primaryDark" : "text"
                }
                hoverEffect="color"
              >
                <Link href={item.href}>{item.label}</Link>
              </PSmall>
            </li>
          ))}
        </SubNavList>
      </ResponsiveContainer>
    </Header>
  );
};
