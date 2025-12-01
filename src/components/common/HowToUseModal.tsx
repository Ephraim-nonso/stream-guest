'use client';

import { useEffect, useState } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Set Your Rate',
    description: 'Configure your hourly rate in USDC and share your wallet address',
  },
  {
    number: 2,
    title: 'Test Deposit',
    description: 'Client sends $1 test deposit to verify commitment before scheduling',
  },
  {
    number: 3,
    title: 'Stream Starts',
    description: 'Payment streams begin when the call starts, paid per second',
  },
  {
    number: 4,
    title: 'Monitor & End',
    description: 'Watch money flow in real-time. Stream stops, call ends immediately',
  },
];

const STEP_DURATION = 3000; // 3 seconds in milliseconds

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Cycle through steps
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentStepIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % steps.length;
          setIsAnimating(false);
          return nextIndex;
        });
      }, 300); // Half of transition duration for smooth fade
    }, STEP_DURATION);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Arrow pointing to button */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 shadow-lg"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-6 text-center pr-6">
          How to Use StreamPay
        </h2>

        {/* Step content */}
        <div className="relative min-h-[180px]">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`
                absolute inset-0 transition-all duration-500 ease-in-out
                ${
                  currentStepIndex === index && !isAnimating
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                {/* Step number circle */}
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Step title */}
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">
                  {step.title}
                </h3>

                {/* Step description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  currentStepIndex === index
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 w-2'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

