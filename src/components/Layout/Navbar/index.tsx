"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divider, Flex, HStack, Stack } from "@/styled-system/jsx";
import { Typography, ResponsiveContainer } from "@/src/components/ui";
import { Header, Nav, NavList, SubNavList } from "./index.styled";
import { HamburgerMenu } from "./components/HamburgerMenu";
import { useAuth } from "@/src/context/auth-context";
import { navLinksMap } from "./constants";
import { stripTrailingSlash } from "./utils/helpers";
import { generateIcon } from "@/src/utils";

type BasePath = keyof typeof navLinksMap;

const AccountIcon = (
  <HStack>
    <Typography weight="bold">Account</Typography>
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
    { label: "Cars", href: "/cars/sales/" },
    { label: "Trucks", href: "/trucks/sales/" },
    { label: "Bikes", href: "/bikes/sales/" },
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
                width={65}
                height={65}
                priority
                sizes="100vw"
                style={{ height: "auto", padding: "0.1rem 0" }}
                alt="Buy Sell Cars logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <NavList>
              {navLinks.map((item) => (
                <Typography
                  key={item.label}
                  as="li"
                  color="primary"
                  hoverEffect="color"
                  weight="bold"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Typography>
              ))}
            </NavList>
          </Flex>

          <Stack
            display={{ base: "none", lg: "flex" }}
            flexDirection="row"
            gap="md"
          >
            <Typography hoverEffect="color" weight="bold">
              <Link href={user ? "/dashboard/add-listing" : "/sign-up"}>
                Sell your vehicle
              </Link>
            </Typography>

            <Typography hoverEffect="color" weight="bold">
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
            <Typography
              key={item.label}
              as="li"
              variant="body2"
              weight={isMatchingPath(item.href, item.label) ? "bold" : "normal"}
              color={
                isMatchingPath(item.href, item.label) ? "primaryDark" : "text"
              }
              hoverEffect="color"
            >
              <Link href={item.href}>{item.label}</Link>
            </Typography>
          ))}
        </SubNavList>
      </ResponsiveContainer>
    </Header>
  );
};
