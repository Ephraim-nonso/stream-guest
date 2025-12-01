'use client';

export function ClientChats() {
  return (
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
  );
}

