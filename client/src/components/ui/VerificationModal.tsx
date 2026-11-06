'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleVerify?: () => void;
}

export default function VerificationModal({ isOpen, onClose, handleVerify }: VerificationModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, secondsRemaining]);

  useEffect(() => {
    if (secondsRemaining === 0) {
      setResendDisabled(false);
    }
  }, [secondsRemaining]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...verificationCode];
      newCode[index - 1] = '';
      setVerificationCode(newCode);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
    if (handleVerify) {
      handleVerify();
    }
  };

  const handleResendCode = () => {
    setResendDisabled(true);
    setSecondsRemaining(120);
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes}m : ${seconds < 10 ? '0' : ''}${seconds}s left`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex flex-col text-center justify-center items-center">
          <div className="w-full flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 hover:text-gray-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <h2 className="text-primary font-bold text-2xl mt-1">OTP Verification</h2>
          <p className="text-text-muted text-sm py-2">Please enter the 6-digit code sent to your email.</p>
          <form onSubmit={handleSubmit} className="w-full mt-4">
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 md:w-12 h-12 text-center text-xl font-bold border border-border-subtle rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-text-main"
                />
              ))}
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 w-full rounded-3xl mt-6 shadow-md transition-all cursor-pointer"
            >
              Verify
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            Didn't receive code?{' '}
            <button
              type="button"
              className={`font-semibold ${
                resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline cursor-pointer'
              }`}
              onClick={handleResendCode}
              disabled={resendDisabled}
            >
              Resend Code
            </button>
          </p>
          <p className="text-xs text-gray-400 mt-2 font-mono">{formatTime()}</p>
        </div>
      </div>
    </div>
  );
}
