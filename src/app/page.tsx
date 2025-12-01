'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout';
import {
  Hero,
  HowToUseButton,
  RoleSelection,
  ExpertSetup,
  ClientSetup,
  ExpertDashboard,
  ClientDashboard,
} from '@/components/common';

type ViewState =
  | 'hero'
  | 'role-selection'
  | 'expert-setup'
  | 'client-setup'
  | 'expert-dashboard'
  | 'client-dashboard';

export default function Home() {
  const { isConnected } = useAccount();
  const [viewState, setViewState] = useState<ViewState>('hero');

  // Update view state when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && viewState === 'hero') {
      setViewState('role-selection');
    } else if (!isConnected) {
      setViewState('hero');
    }
  }, [isConnected, viewState]);

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

  const handleExpertComplete = () => {
    setViewState('expert-dashboard');
  };

  const handleClientComplete = () => {
    setViewState('client-dashboard');
  };

  // Determine what to show based on wallet connection and view state
  const renderContent = () => {
    if (!isConnected) {
      return <Hero />;
    }

    switch (viewState) {
      case 'role-selection':
        return <RoleSelection onRoleSelect={handleRoleSelect} />;
      case 'expert-setup':
        return (
          <ExpertSetup onBack={handleBack} onComplete={handleExpertComplete} />
        );
      case 'client-setup':
        return (
          <ClientSetup onBack={handleBack} onComplete={handleClientComplete} />
        );
      case 'expert-dashboard':
        return <ExpertDashboard />;
      case 'client-dashboard':
        return <ClientDashboard />;
      default:
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
