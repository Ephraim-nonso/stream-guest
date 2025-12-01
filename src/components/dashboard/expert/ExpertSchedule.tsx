'use client';

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

export function ExpertSchedule() {
  const handleStartCall = (consultationId: string) => {
    // TODO: Implement start call functionality
    console.log('Start call for consultation:', consultationId);
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e] mb-4 sm:mb-6">
        Upcoming Consultations
      </h2>

      {scheduledConsultations.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">No upcoming consultations.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {scheduledConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section: Consultation Details */}
                <div className="flex-1 min-w-0">
                  {/* Client Name and Test Deposit Badge */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#1a1a2e]">
                      {consultation.clientName}
                    </h3>
                    {consultation.hasTestDeposit && (
                      <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                        Test Deposit ✓
                      </span>
                    )}
                  </div>

                  {/* Organization */}
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    {consultation.organization}
                  </p>

                  {/* Date, Time, and Duration */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span>
                      {consultation.date} at {consultation.time}
                    </span>
                    <span>{consultation.duration}</span>
                  </div>
                </div>

                {/* Right Section: Action Button */}
                <div className="md:ml-4 w-full md:w-auto">
                  <button
                    onClick={() => handleStartCall(consultation.id)}
                    className={`w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base ${
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
  );
}

