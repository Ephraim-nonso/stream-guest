'use client';

import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isActive: boolean;
}

export function FeatureCard({ icon, title, description, isActive }: FeatureCardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl p-6 md:p-8 shadow-lg
        transition-all duration-1000 ease-in-out
        ${isActive 
          ? 'opacity-100 translate-y-0 scale-100 z-10' 
          : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute inset-0 z-0'
        }
        w-full max-w-md mx-auto
      `}
      style={{
        transitionProperty: 'opacity, transform, scale',
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <div 
          className={`
            w-12 h-12 flex items-center justify-center
            transition-transform duration-700 ease-out
            ${isActive ? 'scale-100' : 'scale-90'}
          `}
          style={{ transitionDelay: isActive ? '200ms' : '0ms' }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 
          className={`
            text-2xl md:text-3xl font-bold text-[#1a1a2e]
            transition-all duration-700 ease-out
            ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
          `}
          style={{ transitionDelay: isActive ? '300ms' : '0ms' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p 
          className={`
            text-base md:text-lg text-gray-600 leading-relaxed
            transition-all duration-700 ease-out
            ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
          `}
          style={{ transitionDelay: isActive ? '400ms' : '0ms' }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

