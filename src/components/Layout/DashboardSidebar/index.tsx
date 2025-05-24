"use client";

import { usePathname } from "next/navigation";
import { Flex, Box, Divider } from "@/styled-system/jsx";
import { SignOut } from "@/src/components/Pages";
import { ResponsiveContainer, Typography } from "@/src/components/ui";
import { HamburgerMenu, NavLinksDashboard } from "./components";

export const DashboardSidebar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isListingPage = pathname === "/dashboard/listings/";

  return (
    <>
      {/* Container */}
      <Flex
        height="100%"
        overflow="hidden"
        borderTop={{ base: "1px solid" }}
        borderColor={{ base: "grey" }}
      >
        <ResponsiveContainer>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems={{
              base: isListingPage ? "normal" : "center",
              md: "normal",
            }}
          >
            {/* Sidebar */}
            <Box
              display={{ base: "none", md: "block" }}
              width="20rem"
              borderRight="1px solid"
              borderColor="grey"
            >
              <Flex
                direction="column"
                justify="center"
                align="stretch"
                overflowY="auto"
                paddingTop="lg"
                paddingBottom="lg"
                gap="md"
              >
                {/* Render different navigation links based on verification status */}
                <NavLinksDashboard pathname={pathname} />

                <Divider width="15rem" marginY="sm" color="grey" />

                <SignOut />
              </Flex>
            </Box>

            {/* Mobile navigation */}
            <Box
              display={{ base: "flex", md: "none" }}
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              backgroundColor="greyLight"
              paddingX="sm"
              marginY="sm"
              borderRadius="1.2rem"
            >
              <Typography weight="bold">Settings</Typography>
              <HamburgerMenu pathname={pathname} />
            </Box>

            <Divider display={{ base: "block", md: "none" }} />

            {/* Main content */}
            <Box
              flex="1"
              overflowY="auto"
              paddingX={{ base: "none", md: "lg" }}
            >
              {children}
            </Box>
          </Flex>
        </ResponsiveContainer>
      </Flex>
    </>
  );
};
