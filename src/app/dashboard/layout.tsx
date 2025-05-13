'use client';

import { Settings, Shield, Activity, Car, Plus, Wallet } from 'lucide-react';
import { DashboardSidebar } from '@/src/components/Layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { href: '/dashboard/', icon: Settings, label: 'General' },
    { href: '/dashboard/add-listing/', icon: Plus, label: 'Add Listing' },
    { href: '/dashboard/listings/', icon: Car, label: 'Your Listings' },
    { href: '/dashboard/performance/', icon: Activity, label: 'Performance' },
    { href: '/dashboard/security/', icon: Shield, label: 'Security' },
    { href: '/dashboard/subscriptions/', icon: Wallet, label: 'Subscriptions' },
  ];

  return <DashboardSidebar navLinks={navLinks}>{children}</DashboardSidebar>;
}
