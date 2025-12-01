'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { FeatureCarousel } from './FeatureCarousel';

export function Hero() {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  const handleConnectWallet = () => {
    open();
  };

  return (
    <section className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="max-w-4xl mx-auto text-center w-full">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
          <span className="text-[#1a1a2e] block">Get Paid Per Second.</span>
          <span className="text-[#2563eb] block">No Trust Required.</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
          Real-time payment streaming for expert consultations. Filter out
          low-intent outreach. Get paid instantly via USDC streams powered by
          Superfluid.
        </p>

        {/* CTA Button */}
        {!isConnected ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleConnectWallet}
            className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 mx-auto w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <span>Connect Wallet</span>
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
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-4 px-4">
            <div className="text-green-600 font-semibold text-base sm:text-lg">
              ✓ Wallet Connected
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConnectWallet}
              className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              Manage Wallet
            </Button>
          </div>
        )}

        {/* Feature Carousel */}
        <div className="mt-8 sm:mt-12 px-4">
          <FeatureCarousel />
        </div>
      </div>
    </section>
  );
}

