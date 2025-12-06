'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getUser } from '@/lib/api';
import { Header } from '@/components/layout';
import {
  Hero,
  HowToUseButton,
  RoleSelection,
  ExpertSetup,
  ClientSetup,
} from '@/components/common';

type ViewState =
  | 'hero'
  | 'role-selection'
  | 'expert-setup'
  | 'client-setup';

export default function Home() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [userRole, setUserRole] = useLocalStorage<'expert' | 'client' | null>('userRole', null);
  const [viewState, setViewState] = useState<ViewState>('hero');

  // Clear role when wallet disconnects
  useEffect(() => {
    if (!isConnected && userRole) {
      setUserRole(null);
    }
  }, [isConnected, userRole, setUserRole]);

  // Check if user exists in backend and redirect accordingly
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!isConnected || !address) return;

      try {
        // Check if user exists in backend
        const user = await getUser(address);
        
        if (user) {
          // User exists in backend, set role and redirect
          setUserRole(user.role);
          if (user.role === 'expert') {
            router.push(`/${address}/dashboard/overview`);
          } else if (user.role === 'client') {
            router.push(`/${address}/dashboard/browse-experts`);
          }
        } else if (userRole) {
          // User has role in localStorage but not in backend
          // Keep the role and allow them to proceed (they might need to re-register)
        }
      } catch (error) {
        // If backend is not available, fall back to localStorage role
        console.warn('Could not check user registration:', error);
        if (userRole === 'expert') {
          router.push(`/${address}/dashboard/overview`);
        } else if (userRole === 'client') {
          router.push(`/${address}/dashboard/browse-experts`);
        }
      }
    };

    checkUserRegistration();
  }, [isConnected, address, router, setUserRole, userRole]);

  // Update view state when wallet connects/disconnects
  useEffect(() => {
    if (!isConnected) {
      setViewState('hero');
    } else if (isConnected && !userRole) {
      // If connected but no role selected, always show role selection
      setViewState('role-selection');
    }
  }, [isConnected, userRole]);

  const handleRoleSelect = (role: 'expert' | 'client') => {
    if (role === 'expert') {
      setViewState('expert-setup');
    } else {
      setViewState('client-setup');
    }
  };

  const handleBack = () => {
    setViewState('role-selection');
  };

  // Determine what to show based on wallet connection and view state
  const renderContent = () => {
    // Not connected - show hero
    if (!isConnected) {
      return <Hero />;
    }

    // If user has a role and is connected, don't render anything
    // The redirect effect will handle navigation to dashboard
    // This prevents the brief flash of role selection when clicking logo
    if (isConnected && address && (userRole === 'expert' || userRole === 'client')) {
      return null; // Will redirect, don't show anything
    }

    // Check viewState first to allow navigation to setup forms
    // This allows users to proceed to setup even if role isn't saved yet
    switch (viewState) {
      case 'expert-setup':
        return (
          <ExpertSetup onBack={handleBack} onComplete={() => {}} />
        );
      case 'client-setup':
        return (
          <ClientSetup onBack={handleBack} onComplete={() => {}} />
        );
      case 'role-selection':
        return <RoleSelection onRoleSelect={handleRoleSelect} />;
      default:
        // If no role is set and we're not in setup, show role selection
        if (userRole !== 'expert' && userRole !== 'client') {
          return <RoleSelection onRoleSelect={handleRoleSelect} />;
        }
        // Fallback to role selection if state is unclear
        return <RoleSelection onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {renderContent()}
      <HowToUseButton />
    </div>
  );
}
