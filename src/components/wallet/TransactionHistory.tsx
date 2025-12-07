"use client";

import { useState } from "react";

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "payment" | "earning";
  description: string;
  date: string;
  time: string;
  amount: number;
  status: "completed" | "processing" | "pending";
  network?: string;
  estimatedCompletion?: string;
  transactionHash?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  filterTabs: string[];
  defaultFilter?: string;
}

export function TransactionHistory({
  transactions,
  filterTabs,
  defaultFilter = "All",
}: TransactionHistoryProps) {
  const [activeFilter, setActiveFilter] = useState(defaultFilter);

  const filteredTransactions =
    activeFilter === "All"
      ? transactions
      : transactions.filter((tx) => {
          if (activeFilter === "Deposits") return tx.type === "deposit";
          if (activeFilter === "Withdrawals") return tx.type === "withdrawal";
          if (activeFilter === "Payments") return tx.type === "payment";
          if (activeFilter === "Earnings") return tx.type === "earning";
          return true;
        });

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
      case "earning":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
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
          </div>
        );
      case "withdrawal":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
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
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        );
      case "payment":
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Completed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Processing
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Pending
          </span>
        );
    }
  };

  const formatAmount = (amount: number, type: Transaction["type"]) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

    if (type === "deposit" || type === "earning") {
      return `+${formatted}`;
    }
    return formatted;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a2e]">
          Transaction History
        </h2>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === tab
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No transactions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                {getTransactionIcon(transaction.type)}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1a1a2e] mb-1">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {transaction.date} at {transaction.time}
                      </p>
                      {transaction.network && (
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.network}
                        </p>
                      )}
                      {transaction.estimatedCompletion && (
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.estimatedCompletion}
                        </p>
                      )}
                      {transaction.transactionHash && (
                        <a
                          href="#"
                          className="text-xs text-orange-500 hover:text-orange-600 mt-1 inline-block"
                        >
                          View Transaction
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold mb-1 ${
                          transaction.type === "deposit" ||
                          transaction.type === "earning"
                            ? "text-green-600"
                            : "text-[#1a1a2e]"
                        }`}
                      >
                        {formatAmount(transaction.amount, transaction.type)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

