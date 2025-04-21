import Link from 'next/link';
import { useState } from 'react';
import { VStack } from '@/styled-system/jsx';
import { Typography } from '@/src/components/ui';
import { NavDrawer, NavList, Overlay } from './index.styled';
import { Bar, BarWrapper, Button } from './index.styled';

export const HamburgerMenu = ({
  navLinks,
}: {
  navLinks: { name: string; path: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
            display={{ base: 'flex', xxl: 'none' }}
            alignItems="flex-start"
          >
            <Typography variant="h4" weight="bold" hoverEffect="color">
              <Link href="#">Sell Your Vehicle</Link>
            </Typography>
            <Typography variant="h4" weight="bold" hoverEffect="color">
              <Link href="#">Login</Link>
            </Typography>
          </VStack>

          <NavList>
            {navLinks.map((link) => (
              <Typography
                key={link.name}
                as="li"
                color="primary"
                hoverEffect="size"
                weight="bold"
              >
                <Link href={link.path}>{link.name}</Link>
              </Typography>
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
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(false);
            }
          }}
        />
      )}
    </>
  );
};
