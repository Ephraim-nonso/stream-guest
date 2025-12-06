'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';
import { Header } from '@/components/layout';
import { UnreadCountBadgeWrapper } from '@/components/chat/UnreadCountBadgeWrapper';

type TabType = 'overview' | 'schedule' | 'history' | 'chats' | 'browse-experts' | 'scheduled-calls';

interface DashboardLayoutProps {
  address: string;
  isExpert: boolean;
  activeTab: TabType;
  children: ReactNode;
}

export function DashboardLayout({ address, isExpert, activeTab, children }: DashboardLayoutProps) {
  const getTabPath = (tab: string) => {
    return `/${address}/dashboard/${tab}`;
  };

  const expertTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'history', label: 'History' },
    { id: 'chats', label: 'Chats' },
  ];

  const clientTabs = [
    { id: 'browse-experts', label: 'Browse Experts' },
    { id: 'scheduled-calls', label: 'Scheduled Calls' },
    { id: 'history', label: 'History' },
    { id: 'chats', label: 'Chats' },
  ];

  const tabs = isExpert ? expertTabs : clientTabs;
  const dashboardTitle = isExpert ? 'Expert Dashboard' : 'Client Dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 md:px-8">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4 sm:mb-6">
            {dashboardTitle}
          </h1>

          {/* Navigation Tabs */}
          <div className="flex gap-3 sm:gap-6 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isChatsTab = tab.id === 'chats';
              return (
                <Link
                  key={tab.id}
                  href={getTabPath(tab.id)}
                  className={`pb-2 px-1 font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base flex-shrink-0 flex items-center ${
                    isActive
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {isChatsTab && <UnreadCountBadgeWrapper />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:px-8">
        {children}
      </div>
    </div>
  );
}

