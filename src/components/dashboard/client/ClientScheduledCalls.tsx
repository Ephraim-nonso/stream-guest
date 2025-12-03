"use client";

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

export function ClientScheduledCalls() {
  const handleStartStream = (callId: string) => {
    // TODO: Implement start stream functionality
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e] mb-4 sm:mb-6">
        Upcoming Consultations
      </h2>

      {scheduledCalls.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">
            No scheduled calls yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {scheduledCalls.map((call) => (
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
                      {call.expertName}
                    </h3>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
                  <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
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
                        {call.date} at {call.time}
                      </span>
                    </div>
                    <span>{call.duration}</span>
                    <span>${call.hourlyRate}/hour</span>
                  </div>
                </div>

                {/* Right Section: Action Button */}
                <div className="md:ml-4 w-full md:w-auto">
                  <button
                    onClick={() => handleStartStream(call.id)}
                    className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
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
  );
}
