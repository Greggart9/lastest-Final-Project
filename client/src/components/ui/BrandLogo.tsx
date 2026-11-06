'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  brandName?: string;
}

export default function BrandLogo({
  className = 'h-9 w-auto',
  showText = true,
  textClassName = 'text-xl font-bold tracking-tight',
  brandName = 'EduCollab',
}: BrandLogoProps) {
  // Split brand name into distinctive two-tone styling (e.g. "Edu" + "Collab")
  const isEduCollab = brandName.toLowerCase().startsWith('educollab');
  const prefix = isEduCollab ? 'Edu' : brandName.slice(0, Math.ceil(brandName.length / 2));
  const suffix = isEduCollab ? 'Collab' : brandName.slice(Math.ceil(brandName.length / 2));
  const isWhiteText = textClassName.includes('text-white');

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Modern geometric open book icon mark */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Base rounded square container */}
          <rect
            width="36"
            height="36"
            rx="10"
            className="fill-primary transition-colors group-hover:fill-primary-hover"
          />

          {/* Minimalist Open Book - Left Leaf */}
          <path
            d="M18 12.2C15.4 10.6 11.8 10.6 9.2 12V23.4C11.8 22.1 15.4 22.1 18 23.6V12.2Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* Minimalist Open Book - Right Leaf */}
          <path
            d="M18 12.2C20.6 10.6 24.2 10.6 26.8 12V23.4C24.2 22.1 20.6 22.1 18 23.6V12.2Z"
            fill="white"
          />

          {/* Center Spine Accent */}
          <line
            x1="18"
            y1="12"
            x2="18"
            y2="23.6"
            stroke="#93c5fd"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Clean page lines */}
          <path
            d="M12.5 15.5C14 14.9 16 15.2 17 15.8"
            stroke="#60a5fa"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M23.5 15.5C22 14.9 20 15.2 19 15.8"
            stroke="#93c5fd"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={textClassName}>
          <span className="text-primary font-extrabold">{prefix}</span>
          <span className={isWhiteText ? 'text-white' : 'text-text-main'}>
            {suffix}
          </span>
        </span>
      )}
    </div>
  );
}
