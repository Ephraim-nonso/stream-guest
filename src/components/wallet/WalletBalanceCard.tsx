"use client";

interface WalletBalanceCardProps {
  balance: number;
  currency?: string;
  subtitle?: string;
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export function WalletBalanceCard({
  balance,
  currency = "USD",
  subtitle = "Available for expert consultations",
  onDeposit,
  onWithdraw,
}: WalletBalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "USDC" ? "USD" : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      {/* Wallet Icon */}
      <div className="absolute top-4 right-4 opacity-20">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-sm sm:text-base font-medium opacity-90 mb-2">
          Wallet Balance
        </h3>
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          {formattedBalance}
        </p>
        <p className="text-sm sm:text-base opacity-90 mb-6">{subtitle}</p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onDeposit && (
            <button
              onClick={onDeposit}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              Deposit
            </button>
          )}
          {onWithdraw && (
            <button
              onClick={onWithdraw}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

