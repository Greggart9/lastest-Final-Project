'use client';

import React from 'react';
import Link from 'next/link';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
}

export default function RegisterModal({ show, onClose }: RegisterModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-end">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-700 font-semibold cursor-pointer text-sm"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>
          <h2 className="text-amber-500 font-bold text-2xl mt-1">Pending Approval</h2>
          <img className="h-28 py-3 object-contain" src="/Images/img27.png" alt="pending status" />
          <p className="text-text-muted font-medium text-sm px-2">
            The registered University will be reviewed and approved by the administrator. A confirmation message will be sent to your email.
          </p>
          <Link href="/settings" className="w-full">
            <button
              className="bg-primary hover:bg-primary-hover py-3 w-full rounded-3xl mt-5 font-bold text-white shadow-md transition-all cursor-pointer"
              onClick={onClose}
            >
              Proceed
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
