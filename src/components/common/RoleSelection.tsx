'use client';

import { useAccount } from 'wagmi';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  buttonHoverColor: string;
  borderColor?: string;
  onGetStarted: () => void;
}

function RoleCard({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  buttonHoverColor,
  borderColor,
  onGetStarted,
}: RoleCardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300
        flex flex-col h-full
        ${borderColor ? `border-l-4 ${borderColor}` : ''}
      `}
    >
      {/* Icon */}
      <div className="mb-4 sm:mb-6 flex justify-center sm:justify-start">{icon}</div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-2 sm:mb-3 text-center sm:text-left">{title}</h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 flex-grow leading-relaxed text-center sm:text-left">
        {description}
      </p>

      {/* Get Started Button */}
      <button
        onClick={onGetStarted}
        className={`${buttonColor} ${buttonHoverColor} flex items-center gap-2 w-full justify-center font-medium transition-colors py-3 sm:py-2 rounded-lg cursor-pointer text-sm sm:text-base`}
      >
        {buttonText}
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
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </button>
    </div>
  );
}

interface RoleSelectionProps {
  onRoleSelect: (role: 'expert' | 'client') => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const { address } = useAccount();

  // Format address for display
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleExpertGetStarted = () => {
    onRoleSelect('expert');
  };

  const handleClientGetStarted = () => {
    onRoleSelect('client');
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="max-w-4xl mx-auto w-full">
        {/* Wallet Connected Badge */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Wallet Connected
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a2e] text-center mb-3 sm:mb-4 px-2">
          Welcome to KonsultPay
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-600 text-center mb-2 px-4">Choose your role to get started</p>

        {/* Wallet Address */}
        {address && (
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-8 sm:mb-12 font-mono px-4 break-all">
            {formatAddress(address)}
          </p>
        )}

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Expert Card */}
          <RoleCard
            icon={
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center relative">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {/* Gear icon overlay */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            }
            title="I'm an Expert"
            description="Receive payments for consultations via real-time USDC streams"
            buttonText="Get Started"
            buttonColor="text-blue-600 hover:bg-blue-50"
            buttonHoverColor="hover:text-blue-700"
            borderColor="border-blue-600"
            onGetStarted={handleExpertGetStarted}
          />

          {/* Client Card */}
          <RoleCard
            icon={
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            }
            title="I'm a Client"
            description="Book expert consultations and pay per second with transparency"
            buttonText="Get Started"
            buttonColor="text-orange-600 hover:bg-orange-50"
            buttonHoverColor="hover:text-orange-700"
            onGetStarted={handleClientGetStarted}
          />
        </div>
      </div>
    </section>
  );
}

