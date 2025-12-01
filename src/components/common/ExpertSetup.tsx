'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function ExpertSetup({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete?: () => void;
}) {
  const { address } = useAccount();
  const router = useRouter();
  const [, setUserRole] = useLocalStorage<'expert' | 'client' | null>('userRole', null);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    professionalTitle: 'Senior Product Manager, Former VP at Tech Co',
    areaOfExpertise: 'Web3, DeFi, Blocko',
    hourlyRate: '300',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return addr;
  };

  const calculateRatePerSecond = (hourlyRate: string) => {
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate <= 0) return 'NaN';
    return (rate / 3600).toFixed(6);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.areaOfExpertise.trim()) {
      newErrors.areaOfExpertise = 'Please fill out this field.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: Handle form submission
      console.log('Expert setup submitted:', formData);
      // Save user role
      setUserRole('expert');
      // Navigate to dashboard on successful submission
      if (address) {
        router.push(`/${address}/dashboard/overview`);
      } else if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="max-w-2xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6 sm:mb-8 text-center px-2">
          Expert Setup
        </h1>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Professional Title */}
            <div>
              <label
                htmlFor="professionalTitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Professional Title
              </label>
              <input
                type="text"
                id="professionalTitle"
                value={formData.professionalTitle}
                onChange={(e) =>
                  handleChange('professionalTitle', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your professional title"
              />
            </div>

            {/* Area of Expertise */}
            <div>
              <label
                htmlFor="areaOfExpertise"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Area of Expertise
              </label>
              <input
                type="text"
                id="areaOfExpertise"
                value={formData.areaOfExpertise}
                onChange={(e) =>
                  handleChange('areaOfExpertise', e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.areaOfExpertise
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="e.g., Web3, DeFi, Blockchain"
              />
              {errors.areaOfExpertise && (
                <div className="mt-2 text-sm text-red-600 bg-gray-100 px-3 py-2 rounded">
                  {errors.areaOfExpertise}
                </div>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                $ Hourly Rate (USDC)
              </label>
              <input
                type="number"
                id="hourlyRate"
                value={formData.hourlyRate}
                onChange={(e) => handleChange('hourlyRate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your hourly rate"
                min="0"
                step="0.01"
              />
              <p className="mt-2 text-sm text-gray-600">
                Payment will stream at ${calculateRatePerSecond(formData.hourlyRate)}/second
              </p>
            </div>

            {/* Payment Wallet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                Payment Wallet
              </label>
              <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-green-700 break-all">
                    {formatAddress(address)}
                  </span>
                  <div className="flex items-center gap-2 text-green-600 ml-4">
                    <svg
                      className="w-5 h-5"
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
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  This is your connected wallet. Payments will stream here.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer text-sm sm:text-base"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium cursor-pointer text-sm sm:text-base"
              >
                Complete Setup
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

