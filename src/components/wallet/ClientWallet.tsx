"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { MethodSelectionCards, type DepositMethod } from "./MethodSelectionCards";
import { TransactionHistory, type Transaction } from "./TransactionHistory";

export function ClientWallet() {
  const { address } = useAccount();
  const [balance] = useState(1500.75); // TODO: Fetch from backend/contract
  const [selectedDepositMethod, setSelectedDepositMethod] = useState("crypto");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Mock transactions - TODO: Fetch from backend
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      description: "Crypto Deposit",
      date: "2025-11-28",
      time: "09:15 AM",
      amount: 1000,
      status: "completed",
      network: "Ethereum (ERC-20)",
      transactionHash: "0x123...",
    },
    {
      id: "2",
      type: "payment",
      description: "Call with Dr. Sarah Chen",
      date: "2025-11-27",
      time: "14:30 PM",
      amount: 300,
      status: "completed",
    },
    {
      id: "3",
      type: "payment",
      description: "Call with Marcus Johnson",
      date: "2025-11-26",
      time: "11:00 AM",
      amount: 225,
      status: "completed",
    },
  ]);

  const depositMethods: DepositMethod[] = [
    {
      id: "crypto",
      name: "Crypto",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "To your wallet address",
      features: ["Instant", "Network fees apply", "Min: $10 USDC"],
    },
    {
      id: "card",
      name: "Card",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      description: "Credit/Debit card",
      features: ["Instant", "Processing fee: 2.9%", "Min: $10 USD | Max: $10,000 USD"],
    },
    {
      id: "bank",
      name: "Bank",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Bank transfer",
      features: ["2-3 business days", "No network fees", "Min: $50 USD"],
      processingTime: "2-3 days",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <WalletBalanceCard
        balance={balance}
        currency="USDC"
        subtitle="Available for expert consultations"
        onDeposit={() => setShowDeposit(!showDeposit)}
        onWithdraw={() => setShowWithdraw(!showWithdraw)}
      />

      {/* Deposit Funds Section */}
      {showDeposit && (
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e]">
              Deposit Funds
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Select Deposit Method
            </h3>
            <MethodSelectionCards
              methods={depositMethods}
              selectedMethod={selectedDepositMethod}
              onSelectMethod={setSelectedDepositMethod}
            />
          </div>

          {/* Crypto Deposit Form */}
          {selectedDepositMethod === "crypto" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                  <option>Ethereum (ERC-20)</option>
                  <option>Polygon</option>
                  <option>Arbitrum</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only send USDC on this network
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Address
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
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  Important:
                </p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• Only send USDC to this address</li>
                  <li>• Sending other tokens may result in permanent loss</li>
                  <li>• Minimum deposit: $10 USDC</li>
                  <li>• Deposits are credited after network confirmation</li>
                </ul>
              </div>
            </div>
          )}

          {/* Card Deposit Form */}
          {selectedDepositMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    USD
                  </span>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer">
                    Max
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min: $10 USD | Max: $10,000 USD per transaction
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  Fee Summary:
                </p>
                <div className="space-y-1 text-sm text-yellow-800">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>$0.00 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee (2.9%):</span>
                    <span>$0.00 USD</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Charge:</span>
                    <span>$0.00 USD</span>
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Deposit with Card
              </button>
            </div>
          )}

          {/* Bank Deposit Form */}
          {selectedDepositMethod === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    USD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min: $50 USD | No maximum limit
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">
                  Bank Transfer Details
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bank Name:</span>
                    <span className="text-blue-900 font-medium">
                      KonsultPay Trust Bank
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Name:</span>
                    <span className="text-blue-900 font-medium">
                      KonsultPay Holdings LLC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Number:</span>
                    <span className="text-blue-900 font-medium">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Routing Number:</span>
                    <span className="text-blue-900 font-medium">021000021</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Reference Code:</span>
                    <span className="text-blue-900 font-medium">
                      SP-WZIPEHQR3
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  Important:
                </p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• Include the reference code in your transfer</li>
                  <li>• Processing time: 2-3 business days</li>
                  <li>• No processing fees for bank transfers</li>
                  <li>• Funds will be credited after confirmation</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Withdraw Funds Section */}
      {showWithdraw && (
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

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Choose network carefully. Funds sent to wrong network may be lost.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount (USDC)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  USDC
                </span>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer">
                  Max
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available: ${balance.toFixed(2)} USDC
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                <option>Ethereum (ERC-20) - Fee: ~$2-5</option>
                <option>Polygon - Fee: ~$0.01-0.1</option>
                <option>Arbitrum - Fee: ~$0.5-2</option>
              </select>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                Withdrawal Summary:
              </p>
              <div className="space-y-1 text-sm text-yellow-800">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>$0.00 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>~$2.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You will Receive:</span>
                  <span>$0.00 USDC</span>
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
        </div>
      )}

      {/* Transaction History */}
      <TransactionHistory
        transactions={transactions}
        filterTabs={["All", "Deposits", "Withdrawals", "Payments"]}
        defaultFilter="All"
      />
    </div>
  );
}

