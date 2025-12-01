'use client';

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

export function ExpertOverview() {
  const { address } = useAccount();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-yellow-600">$</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">$4,250</p>
            </div>
          </div>
        </div>

        {/* Completed Calls */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed Calls</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">14</p>
            </div>
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
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
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Hourly Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">$300</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Wallet Section */}
      <div className="bg-blue-900 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0"
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
          <h2 className="text-lg sm:text-xl font-semibold text-white">Your Payment Wallet</h2>
        </div>
        <div className="flex items-center justify-between bg-blue-800 rounded-lg p-3 sm:p-4 gap-2">
          <span className="font-mono text-yellow-400 text-xs sm:text-sm break-all min-w-0">
            {address || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'}
          </span>
          <button
            onClick={() => copyToClipboard(address || '')}
            className="ml-2 sm:ml-4 p-1.5 sm:p-2 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex-shrink-0"
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
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e] mb-4 sm:mb-6">Recent Calls</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentCalls.map((call) => (
            <div
              key={call.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1a1a2e] mb-1 text-sm sm:text-base">
                  {call.clientName}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">{call.description}</p>
                <p className="text-gray-500 text-xs">
                  {call.date} . {call.duration}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <span className="font-semibold text-[#1a1a2e] text-sm sm:text-base">{call.earnings}</span>
                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                  {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

