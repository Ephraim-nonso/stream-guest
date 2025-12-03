"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useChatContext } from "stream-chat-react";
import { createChannelId } from "@/components/chat/ChatUtils";
import { experts } from "@/components/common/data/experts";

export function ClientBrowseExperts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState<Set<string>>(
    new Set()
  );
  const { address } = useAccount();
  const router = useRouter();

  // Get chat client - wrap in try/catch since it might not be available
  let client;
  try {
    const chatContext = useChatContext();
    client = chatContext?.client;
  } catch {
    client = null;
  }

  // Get all unique expertise values from experts
  const allExpertise = Array.from(
    new Set(experts.flatMap((expert) => expert.expertise))
  ).sort();

  // Filter experts based on search query and selected expertise
  const filteredExperts = experts.filter((expert) => {
    // Filter by selected expertise
    if (selectedExpertise.size > 0) {
      const hasSelectedExpertise = expert.expertise.some((exp) =>
        selectedExpertise.has(exp)
      );
      if (!hasSelectedExpertise) {
        return false;
      }
    }

    // Filter by search query
    if (!searchQuery.trim()) {
      return true; // Show all experts if search is empty
    }

    const query = searchQuery.trim().toLowerCase();

    // Check if any expertise exactly matches the search query (case-insensitive)
    const hasMatchingExpertise = expert.expertise.some(
      (exp) => exp.toLowerCase() === query
    );

    // Check if name matches
    const nameMatches = expert.name.toLowerCase().includes(query);

    // Check if any expertise contains the query (partial match)
    const expertiseContains = expert.expertise.some((exp) =>
      exp.toLowerCase().includes(query)
    );

    // Check if title contains the query
    const titleMatches = expert.title.toLowerCase().includes(query);

    return (
      hasMatchingExpertise || nameMatches || expertiseContains || titleMatches
    );
  });

  const toggleExpertise = (expertise: string) => {
    const newSelected = new Set(selectedExpertise);
    if (newSelected.has(expertise)) {
      newSelected.delete(expertise);
    } else {
      newSelected.add(expertise);
    }
    setSelectedExpertise(newSelected);
  };

  const clearFilters = () => {
    setSelectedExpertise(new Set());
    setSearchQuery("");
  };

  const handleConnectExpert = async (expertId: string) => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!client) {
      alert("Chat is not available. Please wait for chat to initialize.");
      return;
    }

    setIsConnecting(expertId);

    try {
      // Find the expert's wallet address from the expert data
      const expert = experts.find((e) => e.id === expertId);
      if (!expert) {
        console.error("Expert not found");
        setIsConnecting(null);
        return;
      }

      const expertAddress = expert.walletAddress.toLowerCase();

      // Check if address is truncated (contains "...")
      if (expertAddress.includes("...")) {
        alert(
          "Expert wallet address is incomplete. Please contact support or ensure expert data has full wallet addresses."
        );
        setIsConnecting(null);
        return;
      }

      // Remove "0x" prefix for channel ID creation (but keep it for member identification)
      const clientAddress = address.toLowerCase();

      // Ensure expert user exists in Stream Chat before creating channel
      // This is required - Stream Chat won't allow adding non-existent users to channels
      try {
        const userResponse = await fetch("/api/stream/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: expertAddress,
            userName: expert.name,
          }),
        });

        if (!userResponse.ok) {
          const error = await userResponse.json();
          console.warn(
            "Failed to create expert user (may already exist):",
            error
          );
          // Continue anyway - user might already exist
        }
      } catch (userError) {
        console.warn("Error creating expert user:", userError);
        // Continue anyway - we'll let Stream Chat handle the error if user doesn't exist
      }

      // Create channel ID (format: "messaging-{hash}")
      // createChannelId creates a deterministic hash that fits within 64 characters
      const fullChannelId = createChannelId(clientAddress, expertAddress);
      const channelType = "messaging";

      // Extract just the ID part from the full channel ID
      // createChannelId returns "messaging-{hash}"
      // We need to extract "{hash}" for the channel ID
      const parts = fullChannelId.split("-");
      const channelId = parts.slice(1).join("-"); // Remove "messaging" prefix

      // Validate channel ID format and length
      // Stream Chat only allows letters, numbers, and "!-_", max 64 chars
      const validChannelIdPattern = /^[a-z0-9!\-_]+$/;
      if (!validChannelIdPattern.test(channelId)) {
        throw new Error(
          `Invalid channel ID format: ${channelId}. Channel IDs can only contain letters, numbers, and "!-_"`
        );
      }
      if (channelId.length > 64) {
        throw new Error(
          `Channel ID too long: ${channelId.length} characters (max 64)`
        );
      }

      // Create or get the channel
      // Note: Channel name can be set after creation if needed
      const channel = client.channel(channelType, channelId, {
        members: [clientAddress, expertAddress],
      });

      // Watch the channel to ensure it's active and create it if it doesn't exist
      await channel.watch();

      // Navigate to chats tab with the full channel ID (for URL parsing)
      router.push(`/${address}/dashboard/chats?channel=${fullChannelId}`);
    } catch (error) {
      console.error("Error creating chat channel:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      alert(
        `Failed to create chat: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please check the console for details.`
      );
    } finally {
      setIsConnecting(null);
    }
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
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base ${
              selectedExpertise.size > 0
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="font-medium">Filters</span>
            {selectedExpertise.size > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs font-bold">
                {selectedExpertise.size}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFilters(false)}
              />
              {/* Dropdown Panel */}
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-[600px] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Filter by Expertise
                  </h3>
                  {selectedExpertise.size > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto p-4 max-h-[500px]">
                  <div className="space-y-2">
                    {allExpertise.map((expertise) => {
                      const isSelected = selectedExpertise.has(expertise);
                      return (
                        <label
                          key={expertise}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleExpertise(expertise)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {expertise}
                          </span>
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-orange-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-xs text-gray-600 mb-2">
                    {selectedExpertise.size > 0
                      ? `${filteredExperts.length} expert${
                          filteredExperts.length !== 1 ? "s" : ""
                        } match your filters`
                      : "Select expertise areas to filter experts"}
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {selectedExpertise.size > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Array.from(selectedExpertise).map((expertise) => (
            <span
              key={expertise}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
            >
              {expertise}
              <button
                onClick={() => toggleExpertise(expertise)}
                className="hover:text-orange-900 focus:outline-none"
                aria-label={`Remove ${expertise} filter`}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Expert Listings */}
      <div className="space-y-3 sm:space-y-4">
        {filteredExperts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600 text-lg mb-2">
              No experts found
              {searchQuery.trim() && ` matching &quot;${searchQuery}&quot;`}
              {selectedExpertise.size > 0 &&
                ` with selected expertise${
                  selectedExpertise.size > 1 ? "s" : ""
                }`}
            </p>
            {(searchQuery.trim() || selectedExpertise.size > 0) && (
              <button
                onClick={clearFilters}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm mt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredExperts.map((expert) => (
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
                    <span className="font-mono">{expert.walletAddress}</span>
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
                <div className="md:ml-4 w-full md:w-auto">
                  <button
                    onClick={() => handleConnectExpert(expert.id)}
                    disabled={isConnecting === expert.id}
                    className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isConnecting === expert.id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
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
                        <span className="hidden sm:inline">
                          Connect & Message
                        </span>
                        <span className="sm:hidden">Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
