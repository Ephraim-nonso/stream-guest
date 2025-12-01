'use client';

interface CallHistory {
  id: string;
  expertName: string;
  topic: string;
  date: string;
  duration: string;
  cost: number;
  status: 'completed' | 'cancelled';
}

const callHistory: CallHistory[] = [
  {
    id: '1',
    expertName: 'Marcus Johnson',
    topic: 'Security',
    date: '2025-11-26',
    duration: '30 min',
    cost: 225,
    status: 'completed',
  },
  {
    id: '2',
    expertName: 'Lisa Anderson',
    topic: 'Tokenomics',
    date: '2025-11-20',
    duration: '45 min',
    cost: 187.5,
    status: 'completed',
  },
];

export function ClientHistory() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e] mb-4 sm:mb-6">
        Call History
      </h2>

      {callHistory.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">No call history yet.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {callHistory.map((call) => (
            <div
              key={call.id}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                {/* Left Section: Call Details */}
                <div className="flex-1 min-w-0">
                  {/* Expert Name */}
                  <h3 className="text-base sm:text-lg font-bold text-[#1a1a2e] mb-2">
                    {call.expertName}
                  </h3>

                  {/* Topic, Date, Duration, and Cost */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
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
                <div className="md:ml-4 flex-shrink-0">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
  );
}

