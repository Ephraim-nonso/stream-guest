"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  const handleConnectWallet = () => {
    open();
  };

  // Format address for display
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and App Name */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a1a2e] truncate">
            StreamGuestPay
          </span>
        </div>

        {/* Connect Wallet Button */}
        {isConnected && address ? (
          <Button
            variant="primary"
            size="md"
            onClick={handleConnectWallet}
            className="bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0"
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden xs:inline">{formatAddress(address)}</span>
            <span className="xs:hidden">••••</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleConnectWallet}
            className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 text-white flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0"
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </Button>
        )}
      </div>
    </header>
  );
}
