"use client";

import { useState } from "react";

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

interface ScheduledCall {
  id: string;
  expertName: string;
  expertise: string[];
  date: string;
  time: string;
  duration: string;
  hourlyRate: number;
  status: "confirmed" | "pending" | "cancelled";
}

interface CallHistory {
  id: string;
  expertName: string;
  topic: string;
  date: string;
  duration: string;
  cost: number;
  status: "completed" | "cancelled";
}

const experts: Expert[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Senior Product Manager, Former VP at Web3 Startup",
    expertise: ["Web3", "DeFi", "Blockchain Infrastructure"],
    walletAddress: "0x742d35Cc6634C05329...",
    rating: 4.9,
    reviewCount: 14,
    hourlyRate: 300,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "Chief Technology Officer, Crypto Exchange",
    expertise: ["Security", "Smart Contracts", "Protocol Design"],
    walletAddress: "0x8f9e5d2c1a4b3e7f6c...",
    rating: 5.0,
    reviewCount: 28,
    hourlyRate: 450,
  },
  {
    id: "3",
    name: "Lisa Anderson",
    title: "Tokenomics Specialist, Former DAO Advisor",
    expertise: ["Tokenomics", "DAO Governance", "NFTs"],
    walletAddress: "0x2b4e6a8c0d2f4e6a8c...",
    rating: 4.8,
    reviewCount: 19,
    hourlyRate: 250,
  },
];

const scheduledCalls: ScheduledCall[] = [
  {
    id: "1",
    expertName: "Dr. Sarah Chen",
    expertise: ["Web3", "DeFi"],
    date: "2025-12-01",
    time: "15:00",
    duration: "60 min",
    hourlyRate: 300,
    status: "confirmed",
  },
];

const callHistory: CallHistory[] = [
  {
    id: "1",
    expertName: "Marcus Johnson",
    topic: "Security",
    date: "2025-11-26",
    duration: "30 min",
    cost: 225,
    status: "completed",
  },
  {
    id: "2",
    expertName: "Lisa Anderson",
    topic: "Tokenomics",
    date: "2025-11-20",
    duration: "45 min",
    cost: 187.5,
    status: "completed",
  },
];

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<
    "browse-experts" | "scheduled-calls" | "history" | "chats"
  >("browse-experts");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendTestDeposit = (expertId: string) => {
    // TODO: Implement test deposit functionality
    console.log("Send test deposit for expert:", expertId);
  };

  const handleStartStream = (callId: string) => {
    // TODO: Implement start stream functionality
    console.log("Start stream for call:", callId);
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            Client Dashboard
          </h1>

          {/* Navigation Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("browse-experts")}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === "browse-experts"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Browse Experts
            </button>
            <button
              onClick={() => setActiveTab("scheduled-calls")}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === "scheduled-calls"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scheduled Calls
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === "history"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`pb-2 px-1 font-medium transition-colors cursor-pointer ${
                activeTab === "chats"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Chats
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-8">
        {activeTab === "browse-experts" && (
          <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
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
            <div className="space-y-4">
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section: Expert Info */}
                    <div className="flex-1">
                      {/* Name and Title */}
                      <h3 className="text-xl font-bold text-[#1a1a2e] mb-1">
                        {expert.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
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
                          </span>{" "}
                          per hour
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Action Button */}
                    <div className="md:ml-4">
                      <button
                        onClick={() => handleSendTestDeposit(expert.id)}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Send Test Deposit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "scheduled-calls" && (
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">
              Upcoming Consultations
            </h2>

            {scheduledCalls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No scheduled calls yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledCalls.map((call) => (
                  <div
                    key={call.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section: Call Details */}
                      <div className="flex-1">
                        {/* Expert Name and Status */}
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-[#1a1a2e]">
                            {call.expertName}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              call.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : call.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {call.status === "confirmed" && "Confirmed ✓"}
                            {call.status === "pending" && "Pending"}
                            {call.status === "cancelled" && "Cancelled"}
                          </span>
                        </div>

                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {call.expertise.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Date, Time, Duration, and Rate */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {call.date} at {call.time}
                            </span>
                          </div>
                          <span>{call.duration}</span>
                          <span>${call.hourlyRate}/hour</span>
                        </div>
                      </div>

                      {/* Right Section: Action Button */}
                      <div className="md:ml-4">
                        <button
                          onClick={() => handleStartStream(call.id)}
                          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Start Stream
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">
              Call History
            </h2>

            {callHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No call history yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {callHistory.map((call) => (
                  <div
                    key={call.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section: Call Details */}
                      <div className="flex-1">
                        {/* Expert Name */}
                        <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">
                          {call.expertName}
                        </h3>

                        {/* Topic, Date, Duration, and Cost */}
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
                            ${call.cost}
                          </span>
                        </div>
                      </div>

                      {/* Right Section: Status Badge */}
                      <div className="md:ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            call.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {call.status === "completed" && "Completed"}
                          {call.status === "cancelled" && "Cancelled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "chats" && (
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
