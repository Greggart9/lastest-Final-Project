'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface PasswordModalProps {
  show: boolean;
  onClose: () => void;
}

export default function PasswordModal({ show, onClose }: PasswordModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <div className="flex flex-col items-center">
          <span
            className="w-full flex justify-end text-primary font-semibold cursor-pointer hover:text-primary-hover"
            onClick={onClose}
          >
            Close
          </span>
          <h2 className="text-primary font-bold text-2xl mt-1">Congratulations!</h2>
          <div className="my-5 w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <p className="text-text-muted font-medium">Your password has been updated</p>
          <Link href="/settings" className="w-full">
            <button
              className="bg-primary hover:bg-primary-hover py-3 w-full rounded-3xl mt-4 font-bold text-white shadow-md transition-all cursor-pointer"
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
