"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  getClientScheduledCalls,
  acceptScheduledCallChanges,
  type ScheduledCall,
} from "@/lib/api";
import { getAllUsers, type User } from "@/lib/api";
import { ScheduleCallModal } from "./ScheduleCallModal";

export function ClientScheduledCalls() {
  const { address } = useAccount();
  const router = useRouter();
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experts, setExperts] = useState<User[]>([]);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [expertsError, setExpertsError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<User | null>(null);
  const [acceptingChangesId, setAcceptingChangesId] = useState<number | null>(null);

  // Fetch scheduled calls
  useEffect(() => {
    if (!address) return;

    const fetchCalls = async () => {
      setIsLoading(true);
      try {
        const calls = await getClientScheduledCalls(address);
        setScheduledCalls(calls);
      } catch (error) {
        console.error("Error fetching scheduled calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalls();
  }, [address]);

  // Fetch experts for modal
  useEffect(() => {
    const fetchExperts = async () => {
      if (!isModalOpen) return;
      
      setIsLoadingExperts(true);
      setExpertsError(null);
      setExperts([]);
      
      try {
        const expertUsers = await getAllUsers("expert");
        setExperts(expertUsers);
        if (expertUsers.length === 0) {
          setExpertsError("No experts available. Please register an expert first.");
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
        setExpertsError(
          error instanceof Error 
            ? error.message 
            : "Failed to load experts. Please try again."
        );
      } finally {
        setIsLoadingExperts(false);
      }
    };

    if (isModalOpen) {
      fetchExperts();
    } else {
      // Reset when modal closes
      setExperts([]);
      setExpertsError(null);
      setIsLoadingExperts(false);
    }
  }, [isModalOpen]);

  const handleStartStream = (callId: string) => {
    // TODO: Implement start stream functionality
  };

  const handleScheduleNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
  };

  const handleScheduleSuccess = async () => {
    // Refresh scheduled calls
    if (address) {
      try {
        const calls = await getClientScheduledCalls(address);
        setScheduledCalls(calls);
      } catch (error) {
        console.error("Error refreshing scheduled calls:", error);
      }
    }
  };

  const handleAcceptChanges = async (callId: number) => {
    setAcceptingChangesId(callId);
    try {
      await acceptScheduledCallChanges(callId);
      // Refresh scheduled calls
      if (address) {
        const calls = await getClientScheduledCalls(address);
        setScheduledCalls(calls);
      }
    } catch (error) {
      console.error("Error accepting changes:", error);
      alert("Failed to accept changes. Please try again.");
    } finally {
      setAcceptingChangesId(null);
    }
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  // Parse expertise from areaOfExpertise string
  const getExpertiseArray = (call: ScheduledCall): string[] => {
    if (call.topics && call.topics.length > 0) {
      return call.topics;
    }
    if (call.areaOfExpertise) {
      return call.areaOfExpertise.split(",").map((e) => e.trim());
    }
    return [];
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e]">
            Upcoming Consultations
          </h2>
          <button
            onClick={handleScheduleNew}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            + Schedule New Call
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-600">Loading...</p>
          </div>
        ) : scheduledCalls.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-600">
              No scheduled calls yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {scheduledCalls.map((call) => {
              const expertise = getExpertiseArray(call);
              return (
                <div
                  key={call.id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section: Call Details */}
                    <div className="flex-1 min-w-0">
                      {/* Expert Name and Status */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg font-bold text-[#1a1a2e]">
                          {call.expertName || "Unknown Expert"}
                        </h3>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            call.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : call.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : call.status === "pending_changes"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {call.status === "confirmed" && "Confirmed ✓"}
                          {call.status === "pending" && "Pending"}
                          {call.status === "pending_changes" && "Changes Requested"}
                          {call.status === "cancelled" && "Cancelled"}
                        </span>
                      </div>

                      {/* Show proposed changes if status is pending_changes */}
                      {call.status === "pending_changes" && call.proposedDate && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs font-semibold text-blue-900 mb-2">
                            Expert requested changes:
                          </p>
                          <div className="text-xs text-blue-700 space-y-1">
                            <p>
                              <span className="font-medium">New Date/Time:</span>{" "}
                              {call.proposedDate} at {call.proposedTime}
                            </p>
                            {call.proposedDuration && (
                              <p>
                                <span className="font-medium">New Duration:</span>{" "}
                                {formatDuration(call.proposedDuration)} minutes
                              </p>
                            )}
                            {call.proposedTopics && call.proposedTopics.length > 0 && (
                              <div>
                                <span className="font-medium">New Topics:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {call.proposedTopics.map((topic, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expertise Tags */}
                      {expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                          {expertise.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Date, Time, Duration, and Rate */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                            {formatDate(call.date)} at {call.time}
                          </span>
                        </div>
                        <span>{formatDuration(call.duration)}</span>
                        <span>${call.hourlyRate}/hour</span>
                      </div>
                    </div>

                    {/* Right Section: Action Button */}
                    <div className="md:ml-4 w-full md:w-auto">
                      {call.status === "pending_changes" && (
                        <button
                          onClick={() => handleAcceptChanges(call.id)}
                          disabled={acceptingChangesId === call.id}
                          className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base disabled:opacity-50"
                        >
                          {acceptingChangesId === call.id
                            ? "Accepting..."
                            : "Accept Changes"}
                        </button>
                      )}
                      {call.status === "confirmed" && (
                        <button
                          onClick={() => handleStartStream(call.id.toString())}
                          className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
                        >
                          Start Stream
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expert Selection Modal */}
      {isModalOpen && !selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a2e]">
                  Select Expert
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {isLoadingExperts ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading experts...</p>
                </div>
              ) : expertsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{expertsError}</p>
                  <button
                    onClick={() => {
                      setExpertsError(null);
                      setIsLoadingExperts(true);
                      getAllUsers("expert")
                        .then((expertUsers) => {
                          setExperts(expertUsers);
                          setIsLoadingExperts(false);
                        })
                        .catch((error) => {
                          console.error("Error fetching experts:", error);
                          setExpertsError("Failed to load experts. Please try again.");
                          setIsLoadingExperts(false);
                        });
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : experts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No experts available.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {experts.map((expert) => (
                    <button
                      key={expert.address}
                      onClick={() => {
                        setSelectedExpert(expert);
                        setIsModalOpen(false);
                      }}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-[#1a1a2e]">{expert.fullName}</h3>
                      <p className="text-sm text-gray-600">{expert.professionalTitle}</p>
                      <p className="text-sm text-gray-600">${expert.hourlyRate || 0}/hour</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Call Form Modal */}
      {selectedExpert && address && (
        <ScheduleCallModal
          isOpen={!!selectedExpert}
          onClose={() => {
            setSelectedExpert(null);
            setIsModalOpen(false);
          }}
          expert={selectedExpert}
          clientAddress={address}
          onSuccess={handleScheduleSuccess}
        />
      )}
    </>
  );
}
