"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  getExpertScheduledCalls,
  confirmScheduledCall,
  type ScheduledCall,
} from "@/lib/api";
import { EditScheduleModal } from "./EditScheduleModal";

export function ExpertSchedule() {
  const { address } = useAccount();
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [editingCall, setEditingCall] = useState<ScheduledCall | null>(null);

  // Fetch scheduled calls
  useEffect(() => {
    if (!address) return;

    const fetchCalls = async () => {
      setIsLoading(true);
      try {
        const calls = await getExpertScheduledCalls(address);
        setScheduledCalls(calls);
      } catch (error) {
        console.error("Error fetching scheduled calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalls();
  }, [address]);

  const handleStartCall = (consultationId: string) => {
    // TODO: Implement start call functionality
  };

  const handleConfirmCall = async (callId: number) => {
    setConfirmingId(callId);
    try {
      await confirmScheduledCall(callId);
      // Refresh the list
      if (address) {
        const calls = await getExpertScheduledCalls(address);
        setScheduledCalls(calls);
      }
    } catch (error) {
      console.error("Error confirming call:", error);
      alert("Failed to confirm call. Please try again.");
    } finally {
      setConfirmingId(null);
    }
  };

  const handleEditCall = (call: ScheduledCall) => {
    setEditingCall(call);
  };

  const handleEditSuccess = async () => {
    if (address) {
      const calls = await getExpertScheduledCalls(address);
      setScheduledCalls(calls);
    }
    setEditingCall(null);
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  // Check if call can be started (confirmed and date/time has passed or is current)
  const canStartCall = (call: ScheduledCall) => {
    if (call.status !== "confirmed") return false;
    const callDateTime = new Date(`${call.date}T${call.time}`);
    const now = new Date();
    return callDateTime <= now;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e] mb-4 sm:mb-6">
        Upcoming Consultations
      </h2>

      {isLoading ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">Loading...</p>
        </div>
      ) : scheduledCalls.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">
            No upcoming consultations.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {scheduledCalls.map((call) => {
            const canStart = canStartCall(call);
            const isPending = call.status === "pending";
            
            return (
              <div
                key={call.id}
                className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Section: Consultation Details */}
                  <div className="flex-1 min-w-0">
                    {/* Client Name and Status Badge */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#1a1a2e]">
                        {call.clientName || "Unknown Client"}
                      </h3>
                      {isPending && (
                        <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium whitespace-nowrap">
                          Pending Confirmation
                        </span>
                      )}
                      {call.status === "pending_changes" && (
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                          Changes Requested
                        </span>
                      )}
                      {call.status === "confirmed" && (
                        <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                          Confirmed ✓
                        </span>
                      )}
                    </div>

                    {/* Organization */}
                    {call.organization && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                        {call.organization}
                      </p>
                    )}

                    {/* Date, Time, and Duration */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span>
                        {call.date} at {call.time}
                      </span>
                      <span>{formatDuration(call.duration)}</span>
                    </div>
                  </div>

                  {/* Right Section: Action Buttons */}
                  <div className="md:ml-4 w-full md:w-auto flex gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleEditCall(call)}
                          className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleConfirmCall(call.id)}
                          disabled={confirmingId === call.id}
                          className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base disabled:opacity-50"
                        >
                          {confirmingId === call.id ? "Confirming..." : "Confirm"}
                        </button>
                      </>
                    )}
                    {call.status === "confirmed" && (
                      <button
                        onClick={() => handleStartCall(call.id.toString())}
                        className={`w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                          canStart
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!canStart}
                      >
                        Start Call
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editingCall && (
        <EditScheduleModal
          isOpen={!!editingCall}
          onClose={() => setEditingCall(null)}
          call={editingCall}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
