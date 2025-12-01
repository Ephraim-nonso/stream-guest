'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-7 h-7 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
    ),
    title: 'Instant Payment',
    description:
      'Money flows into your wallet every second during the call. No invoicing, no waiting, no follow-ups.',
  },
  {
    icon: (
      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-7 h-7 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
    ),
    title: 'Zero Risk',
    description:
      'Stream stops, call ends. Complete transparency with blockchain verification. You control the wallet.',
  },
  {
    icon: (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-7 h-7 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
    title: 'Filter Spam',
    description:
      '$1 test deposit required. Eliminates 95% of low-intent outreach before you commit any time.',
  },
];

const CYCLE_DURATION = 10000; // 10 seconds in milliseconds

export function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to move to next card
  const nextCard = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
  }, []);

  // Function to start/reset the auto-rotation timer
  const startAutoRotation = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(nextCard, CYCLE_DURATION);
  }, [nextCard]);

  // Initialize auto-rotation on mount
  useEffect(() => {
    startAutoRotation();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoRotation]);

  // Handle manual navigation - reset timer when user clicks a dot
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    startAutoRotation(); // Reset the timer
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-12 md:mt-16 min-h-[280px]">
      <div className="relative">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isActive={activeIndex === index}
          />
        ))}
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center gap-2 mt-6">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`
              h-2 rounded-full transition-all duration-500 ease-in-out cursor-pointer
              ${activeIndex === index ? 'bg-orange-500 w-8' : 'bg-gray-300 w-2'}
              hover:bg-orange-400
            `}
            aria-label={`Go to feature ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

