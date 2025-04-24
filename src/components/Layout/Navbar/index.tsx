'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Stack } from '@/styled-system/jsx';
import { Button, Typography, ResponsiveContainer } from '@/src/components/ui';
import { Header, Nav, NavList } from './index.styled';
import { HamburgerMenu } from './components/HamburgerMenu';

const navLinks = [
  { name: 'Used cars', path: '#' },
  { name: 'New cars', path: '#' },
  { name: 'Bikes', path: '#' },
  { name: 'Trucks', path: '#' },
  { name: 'Farm', path: '#' },
  { name: 'Plant', path: '#' },
];

export const Navbar = () => {
  return (
    <Header>
      <ResponsiveContainer>
        <Nav>
          <Link href="/">
            <Image
              src="/logo/buy-sell-cars-logo.png"
              width={100}
              height={90}
              style={{ height: 'auto' }}
              alt="Buy Sell Cars logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavList>
            {navLinks.map((link) => (
              <Typography
                key={link.name}
                as="li"
                variant="h4"
                color="primary"
                hoverEffect="size"
                weight="bold"
              >
                <Link href={link.path}>{link.name}</Link>
              </Typography>
            ))}
          </NavList>

          <Stack
            display={{ base: 'none', xxl: 'flex' }}
            flexDirection="row"
            gap="md"
          >
            <Button fontWeight="bold">Sell Your Vehicle</Button>
            <Button fontWeight="bold" variant="ghost">
              Login
            </Button>
          </Stack>

          {/* Hamburger Menu Button */}
          <HamburgerMenu navLinks={navLinks} />
        </Nav>
      </ResponsiveContainer>
    </Header>
  );
};
