'use client';

import React from 'react';
import Link from 'next/link';

interface CongratulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CongratulationModal({ isOpen, onClose }: CongratulationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-end">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg cursor-pointer">
              ✕
            </button>
          </div>
          <h2 className="text-primary font-bold text-2xl">Congratulations!</h2>
          <img className="h-28 py-3 object-contain" src="/Images/tick.png" alt="tick logo" />
          <p className="text-text-muted font-medium">Your account has been created successfully</p>
          <Link href="/collegeboard" className="w-full">
            <button
              onClick={onClose}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 w-full rounded-3xl mt-5 shadow-md transition-all cursor-pointer"
            >
              Proceed to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
