import React, { useState, useEffect, useRef } from 'react';

function VerificationModal({ isOpen, onClose, handleVerify }) {
  const [secondsRemaining, setSecondsRemaining] = useState(120); // Initial time in seconds
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendDisabled, setResendDisabled] = useState(false);

  const inputRefs = useRef([]);
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer;
    if (isOpen && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, secondsRemaining]);

  useEffect(() => {
    if (secondsRemaining === 0) {
      setResendDisabled(false);
    }
  }, [secondsRemaining]);

  const handleInputChange = (index, e) => {
    const { value } = e.target;
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      handleInputChange(index - 1, { target: { value: '' } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate verification code
    // Send verification code to server for validation
    // Close modal after verification
    onClose();  
    handleVerify();
    
  };

  const handleResendCode = () => {
    setResendDisabled(true);
    // Send request to resend verification code
    // Start the timer again
    setSecondsRemaining(120); // Reset timer to initial time
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes}m : ${seconds < 10 ? '0' : ''}${seconds}s left`;
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-1 md:p-2 rounded'>
            <div className="modal-content flex flex-col px-5 text-center md:px-7 py-2 md:py-4 justify-center items-center">
              <div className='md:w-[25rem] w-[20rem] flex justify-end'><span className=" close cursor-pointer text-gray-600 font-bold" onClick={onClose}>close</span></div>
              <h2 className='text-blue-400 font-bold text-xl'>OTP Verification</h2>
              <p className='p-2'>Please enter the 6-digit code sent to your email.</p>
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-11 md:w-12 h-11 md:h-12 text-center border border-gray-300 rounded"
                    />
                  ))}
                </div>
                <button className='bg-gray-100 py-3 w-[18rem] md:w-[25rem] rounded-3xl mt-3 font-bold text-gray-400' onClick={handleSubmit} type="submit">Verify</button>
              </form>
              <p>
                Didn’t receive code? 
                <button 
                  className={`ml-1 ${resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-400 underline'}`} 
                  onClick={handleResendCode}
                  disabled={resendDisabled}
                >
                  Resend Code
                </button>
              </p>
              <p>{formatTime()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerificationModal;
