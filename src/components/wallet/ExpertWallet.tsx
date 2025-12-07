"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { BalanceCards } from "./BalanceCards";
import { MethodSelectionCards, type DepositMethod } from "./MethodSelectionCards";
import { TransactionHistory, type Transaction } from "./TransactionHistory";

export function ExpertWallet() {
  const { address } = useAccount();
  const [availableBalance] = useState(3890.5);
  const [pendingBalance] = useState(359.5);
  const [totalEarnings] = useState(4250);
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState("crypto");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  // Mock transactions - TODO: Fetch from backend
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "earning",
      description: "Call with James Liu",
      date: "2025-11-27",
      time: "14:30 PM",
      amount: 225,
      status: "completed",
      transactionHash: "0x123...",
    },
    {
      id: "2",
      type: "withdrawal",
      description: "Withdrawal to wallet",
      date: "2025-11-25",
      time: "10:15 AM",
      amount: 500,
      status: "completed",
      network: "Ethereum (ERC-20)",
      transactionHash: "0x456...",
    },
    {
      id: "3",
      type: "earning",
      description: "Call with Anna Schmidt",
      date: "2025-11-25",
      time: "09:00 AM",
      amount: 300,
      status: "completed",
      transactionHash: "0x789...",
    },
    {
      id: "4",
      type: "withdrawal",
      description: "Bank Transfer (USD)",
      date: "2025-11-23",
      time: "03:45 PM",
      amount: 750,
      status: "processing",
      estimatedCompletion: "Est. completion: 2-3 business days",
    },
    {
      id: "5",
      type: "earning",
      description: "Call with Michael Roberts",
      date: "2025-11-22",
      time: "11:20 AM",
      amount: 180,
      status: "pending",
    },
  ]);

  const withdrawalMethods: DepositMethod[] = [
    {
      id: "crypto",
      name: "Crypto Withdrawal",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "To your wallet address",
      features: ["Instant transfer", "Network fees apply", "Min: $10 USDC"],
    },
    {
      id: "bank",
      name: "Bank Transfer (Fiat)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "To your bank account",
      features: ["2-3 business days", "No network fees", "Min: $50 USD"],
      processingTime: "2-3 days",
    },
  ];

  const balanceCards = [
    {
      title: "Available Balance",
      amount: availableBalance,
      subtitle: "Ready to withdraw",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      title: "Pending Balance",
      amount: pendingBalance,
      subtitle: "Processing soon",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      title: "Total Earnings",
      amount: totalEarnings,
      subtitle: "All-time",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
  ];

  const calculateWithdrawalSummary = () => {
    const amount = parseFloat(withdrawalAmount) || 0;
    const networkFee = selectedWithdrawalMethod === "crypto" ? 2 : 0;
    const processingFee = selectedWithdrawalMethod === "bank" ? 0 : 0;
    const totalFee = networkFee + processingFee;
    const receiveAmount = amount - totalFee;

    return { amount, networkFee, processingFee, totalFee, receiveAmount };
  };

  const summary = calculateWithdrawalSummary();

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <BalanceCards cards={balanceCards} />

      {/* Withdraw Funds Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <svg
            className="w-5 h-5 text-gray-600"
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
          <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e]">
            Withdraw Funds
          </h2>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Select Withdrawal Method
          </h3>
          <MethodSelectionCards
            methods={withdrawalMethods}
            selectedMethod={selectedWithdrawalMethod}
            onSelectMethod={setSelectedWithdrawalMethod}
          />
        </div>

        {/* Crypto Withdrawal Form */}
        {selectedWithdrawalMethod === "crypto" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Wallet Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address || ""}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Using your connected wallet address
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                <option>Ethereum (ERC-20)</option>
                <option>Polygon</option>
                <option>Arbitrum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USDC)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  USDC
                </span>
                <button
                  onClick={() => setWithdrawalAmount(availableBalance.toString())}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Max
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available: ${availableBalance.toFixed(2)} USDC
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                Withdrawal Summary:
              </p>
              <div className="space-y-1 text-sm text-yellow-800">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${summary.amount.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>~${summary.networkFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You will Receive:</span>
                  <span>${summary.receiveAmount.toFixed(2)} USDC</span>
                </div>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
              <svg
                className="w-5 h-5"
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
              Withdraw to Wallet
            </button>
          </div>
        )}

        {/* Bank Withdrawal Form */}
        {selectedWithdrawalMethod === "bank" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-semibold text-blue-900">
                  Processing Time: 2-3 Business Days
                </p>
              </div>
              <p className="text-xs text-blue-700">
                Bank transfers are processed Monday-Friday. Weekends and holidays
                may extend delivery time.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                <option>Select a bank account</option>
                <option>Chase Bank - ****1234</option>
                <option>Bank of America - ****5678</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                <option>USD (United States Dollar)</option>
                <option>EUR (Euro)</option>
                <option>GBP (British Pound)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  USD
                </span>
                <button
                  onClick={() => setWithdrawalAmount(availableBalance.toString())}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Max
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available: ${availableBalance.toFixed(2)} USD
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                Withdrawal Summary:
              </p>
              <div className="space-y-1 text-sm text-yellow-800">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${summary.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>${summary.processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You will Receive:</span>
                  <span>${summary.receiveAmount.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
              <svg
                className="w-5 h-5"
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
              Withdraw to Bank Account
            </button>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <TransactionHistory
        transactions={transactions}
        filterTabs={["All", "Earnings", "Withdrawals"]}
        defaultFilter="All"
      />
    </div>
  );
}

