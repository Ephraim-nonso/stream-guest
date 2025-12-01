'use client';

import { useState } from 'react';

interface Expert {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  walletAddress: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
}

const experts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Senior Product Manager, Former VP at Web3 Startup',
    expertise: ['Web3', 'DeFi', 'Blockchain Infrastructure'],
    walletAddress: '0x742d35Cc6634C05329...',
    rating: 4.9,
    reviewCount: 14,
    hourlyRate: 300,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'Chief Technology Officer, Crypto Exchange',
    expertise: ['Security', 'Smart Contracts', 'Protocol Design'],
    walletAddress: '0x8f9e5d2c1a4b3e7f6c...',
    rating: 5.0,
    reviewCount: 28,
    hourlyRate: 450,
  },
  {
    id: '3',
    name: 'Lisa Anderson',
    title: 'Tokenomics Specialist, Former DAO Advisor',
    expertise: ['Tokenomics', 'DAO Governance', 'NFTs'],
    walletAddress: '0x2b4e6a8c0d2f4e6a8c...',
    rating: 4.8,
    reviewCount: 19,
    hourlyRate: 250,
  },
];

export function ClientBrowseExperts() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleConnectExpert = (expertId: string) => {
    // TODO: Implement connection functionality
    // This will create a chat connection between client and expert
    console.log('Connect with expert:', expertId);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-${index})`}
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
            );
          } else {
            return (
              <svg
                key={index}
                className="w-4 h-4 text-gray-300 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by expertise, name, or keywords..."
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          />
        </div>
        <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-gray-700">Filters</span>
        </button>
      </div>

      {/* Expert Listings */}
      <div className="space-y-3 sm:space-y-4">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left Section: Expert Info */}
              <div className="flex-1 min-w-0">
                {/* Name and Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a2e] mb-1">
                  {expert.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3">
                  {expert.title}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {expert.expertise.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Wallet Address */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4"
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
                  <span className="font-mono">
                    {expert.walletAddress}
                  </span>
                </div>

                {/* Rating and Hourly Rate */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(expert.rating)}
                    <span className="text-sm font-medium text-gray-700">
                      {expert.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({expert.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-[#1a1a2e]">
                      ${expert.hourlyRate}
                    </span>{' '}
                    per hour
                  </div>
                </div>
              </div>

              {/* Right Section: Action Button */}
              <div className="md:ml-4 w-full md:w-auto">
                <button
                  onClick={() => handleConnectExpert(expert.id)}
                  className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  <span className="hidden sm:inline">Connect & Message</span>
                  <span className="sm:hidden">Message</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

