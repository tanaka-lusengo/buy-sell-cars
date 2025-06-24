import Link from "next/link";
import { Typography } from "~bsc-shared/ui";
import { Box, Flex } from "@/styled-system/jsx";
import { navLinksDashboard } from "./navLinkData";

export const NavLinksDashboard = ({ pathname }: { pathname: string }) => {
  return (
    <>
      {navLinksDashboard.map((item) => {
        return item.href ? (
          <Link key={item.href} href={item.href} passHref>
            <Flex justifyContent="flex-start" align="center" gap="md">
              <Box width="2rem">{item.icon}</Box>
              <Typography
                weight={pathname === item.href ? "bold" : "normal"}
                color={pathname === item.href ? "primaryDark" : "text"}
                hoverEffect="color"
              >
                {item.label}
              </Typography>
            </Flex>
          </Link>
        ) : (
          <Typography key={item.href} weight="bold">
            {item.label}
          </Typography>
        );
      })}
    </>
  );
};
