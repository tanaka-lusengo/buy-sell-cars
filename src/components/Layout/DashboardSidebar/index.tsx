'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideProps } from 'lucide-react';
import { Flex, Box, Divider } from '@/styled-system/jsx';
import { SignOut } from '@/src/components/Pages';
import { ResponsiveContainer, Typography } from '@/src/components/ui';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { HamburgerMenu } from './components/HamburgerMenu';

type DashboardSidebarProps = {
  navLinks: {
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    label: string;
  }[];
  children: React.ReactNode;
};

export const DashboardSidebar = ({
  navLinks,
  children,
}: DashboardSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Container */}
      <Flex
        height="100%"
        overflow="hidden"
        borderTop={{ base: '1px solid' }}
        borderColor={{ base: 'grey' }}
      >
        <ResponsiveContainer>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'center', md: 'normal' }}
          >
            {/* Sidebar */}
            <Box
              display={{ base: 'none', md: 'block' }}
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
                {navLinks.map((item) => (
                  <Link key={item.href} href={item.href} passHref>
                    <Flex justifyContent="flex-start" align="center" gap="md">
                      <item.icon width="20" height="20" />
                      <Typography
                        as="span"
                        weight={pathname === item.href ? 'bold' : 'normal'}
                        color={pathname === item.href ? 'primaryDark' : 'text'}
                        hoverEffect="color"
                      >
                        {item.label}
                      </Typography>
                    </Flex>
                  </Link>
                ))}

                <Divider width="15rem" marginY="sm" color="grey" />

                <SignOut />
              </Flex>
            </Box>

            {/* Mobile navigation */}
            <Box
              display={{ base: 'flex', md: 'none' }}
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              backgroundColor="greyLight"
              paddingX="sm"
              marginY="sm"
              borderRadius="1.2rem"
            >
              <Typography weight="bold">Settings</Typography>
              <HamburgerMenu navLinks={navLinks} />
            </Box>

            <Divider display={{ base: 'block', md: 'none' }} />

            {/* Main content */}
            <Box
              flex="1"
              overflowY="auto"
              paddingX={{ base: 'none', md: 'lg' }}
            >
              {children}
            </Box>
          </Flex>
        </ResponsiveContainer>
      </Flex>
    </>
  );
};
