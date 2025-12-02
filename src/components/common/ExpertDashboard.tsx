'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface Call {
  id: string;
  clientName: string;
  description: string;
  date: string;
  duration: string;
  earnings: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface ScheduledConsultation {
  id: string;
  clientName: string;
  organization: string;
  date: string;
  time: string;
  duration: string;
  hasTestDeposit: boolean;
  canStart: boolean;
}

interface ExpertCallHistory {
  id: string;
  clientName: string;
  topic: string;
  date: string;
  duration: string;
  earnings: number;
  status: 'completed' | 'cancelled';
}

const recentCalls: Call[] = [
  {
    id: '1',
    clientName: 'James Liu',
    description: 'Crypto Insights',
    date: '2025-11-27',
    duration: '45 min',
    earnings: '$225',
    status: 'completed',
  },
  {
    id: '2',
    clientName: 'Anna Schmidt',
    description: 'Token Economics Lab',
    date: '2025-11-25',
    duration: '60 min',
    earnings: '$300',
    status: 'completed',
  },
];

const scheduledConsultations: ScheduledConsultation[] = [
  {
    id: '1',
    clientName: 'Michael Roberts',
    organization: 'Blockchain Ventures',
    date: '2025-11-30',
    time: '14:00',
    duration: '60 min',
    hasTestDeposit: true,
    canStart: true,
  },
  {
    id: '2',
    clientName: 'Emily Watson',
    organization: 'DeFi Research Group',
    date: '2025-12-02',
    time: '10:30',
    duration: '30 min',
    hasTestDeposit: false,
    canStart: false,
  },
];

const expertCallHistory: ExpertCallHistory[] = [
  {
    id: '1',
    clientName: 'James Liu',
    topic: 'Crypto Insights',
    date: '2025-11-27',
    duration: '45 min',
    earnings: 225,
    status: 'completed',
  },
  {
    id: '2',
    clientName: 'Anna Schmidt',
    topic: 'Token Economics Lab',
    date: '2025-11-25',
    duration: '60 min',
    earnings: 300,
    status: 'completed',
  },
];

export function ExpertDashboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'history' | 'chats'>('overview');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const handleStartCall = (consultationId: string) => {
    // TODO: Implement start call functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            Expert Dashboard
          </h1>

          {/* Navigation Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'schedule'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'chats'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chats
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Earnings */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">$</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-[#1a1a2e]">$4,250</p>
                  </div>
                </div>
              </div>

              {/* Completed Calls */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completed Calls</p>
                    <p className="text-2xl font-bold text-[#1a1a2e]">14</p>
                  </div>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                    <p className="text-2xl font-bold text-[#1a1a2e]">$300</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Wallet Section */}
            <div className="bg-blue-900 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-white">Your Payment Wallet</h2>
              </div>
              <div className="flex items-center justify-between bg-blue-800 rounded-lg p-4">
                <span className="font-mono text-yellow-400 text-sm break-all">
                  {address || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'}
                </span>
                <button
                  onClick={() => copyToClipboard(address || '')}
                  className="ml-4 p-2 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Copy address"
                >
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Recent Calls Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">Recent Calls</h2>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1a1a2e] mb-1">
                        {call.clientName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">{call.description}</p>
                      <p className="text-gray-500 text-xs">
                        {call.date} . {call.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#1a1a2e]">{call.earnings}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">
              Upcoming Consultations
            </h2>

            {scheduledConsultations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No upcoming consultations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section: Consultation Details */}
                      <div className="flex-1">
                        {/* Client Name and Test Deposit Badge */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#1a1a2e]">
                            {consultation.clientName}
                          </h3>
                          {consultation.hasTestDeposit && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Test Deposit ✓
                            </span>
                          )}
                        </div>

                        {/* Organization */}
                        <p className="text-gray-600 text-sm mb-3">
                          {consultation.organization}
                        </p>

                        {/* Date, Time, and Duration */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>
                            {consultation.date} at {consultation.time}
                          </span>
                          <span>{consultation.duration}</span>
                        </div>
                      </div>

                      {/* Right Section: Action Button */}
                      <div className="md:ml-4">
                        <button
                          onClick={() => handleStartCall(consultation.id)}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            consultation.canStart
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!consultation.canStart}
                        >
                          Start Call
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">
              Call History
            </h2>

            {expertCallHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No call history yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expertCallHistory.map((call) => (
                  <div
                    key={call.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section: Call Details */}
                      <div className="flex-1">
                        {/* Client Name */}
                        <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">
                          {call.clientName}
                        </h3>

                        {/* Topic, Date, Duration, and Earnings */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium text-gray-700">
                            {call.topic}
                          </span>
                          <span>•</span>
                          <span>
                            {call.date} • {call.duration}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#1a1a2e]">
                            ${call.earnings}
                          </span>
                        </div>
                      </div>

                      {/* Right Section: Status Badge */}
                      <div className="md:ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            call.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {call.status === 'completed' && 'Completed'}
                          {call.status === 'cancelled' && 'Cancelled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">
                Upcoming Features
              </h3>
              <p className="text-gray-600">
                Chat functionality will be available soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

