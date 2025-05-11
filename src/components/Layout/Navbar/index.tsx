'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stack } from '@/styled-system/jsx';
import { Button, Typography, ResponsiveContainer } from '@/src/components/ui';
import { Header, Nav, NavList } from './index.styled';
import { HamburgerMenu } from './components/HamburgerMenu';
import { useAuth } from '@/src/context/auth-context';

const navLinks = [
  { name: 'Used cars', path: '#' },
  { name: 'New cars', path: '#' },
  { name: 'Car rentals', path: '#' },
  { name: 'Bikes', path: '#' },
  { name: 'Trucks', path: '#' },
  { name: 'Agriculture', path: '#' },
  { name: 'Earth moving', path: '#' },
  { name: 'Dealers', path: '#' },
];

export const Navbar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const isSignUpPage = pathname === '/sign-up/';
  const isSignInPage = pathname === '/sign-in/';

  if (isSignUpPage || isSignInPage) {
    return null;
  }

  return (
    <Header>
      <ResponsiveContainer>
        <Nav>
          <Link href="/">
            <Image
              src="/logo/buy-sell-cars-logo.png"
              width={75}
              height={90}
              style={{ height: 'auto', padding: '0.1rem 0' }}
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
                hoverEffect="color"
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
            <Button fontWeight="bold">
              <Link href={user ? '/dashboard/add-listing' : '/sign-up'}>
                Sell Your Vehicle
              </Link>
            </Button>

            <Button fontWeight="bold" variant="ghost">
              <Link href={`${user ? '/dashboard' : '/sign-in'}`}>
                {user ? 'Account' : 'Login'}
              </Link>
            </Button>
          </Stack>

          {/* Hamburger Menu Button */}
          <HamburgerMenu navLinks={navLinks} />
        </Nav>
      </ResponsiveContainer>
    </Header>
  );
};
