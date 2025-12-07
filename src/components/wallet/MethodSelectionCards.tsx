"use client";

export interface DepositMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  processingTime?: string;
}

interface MethodSelectionCardsProps {
  methods: DepositMethod[];
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
}

export function MethodSelectionCards({
  methods,
  selectedMethod,
  onSelectMethod,
}: MethodSelectionCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {methods.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
              isSelected
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`${
                  isSelected ? "text-orange-500" : "text-gray-400"
                }`}
              >
                {method.icon}
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    isSelected ? "text-orange-700" : "text-gray-900"
                  }`}
                >
                  {method.name}
                </h3>
                {method.processingTime && (
                  <p className="text-xs text-gray-600">{method.processingTime}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{method.description}</p>
            <ul className="text-xs text-gray-500 space-y-1">
              {method.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}

