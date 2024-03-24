import React from 'react';

function CongratulationModal({ isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-2 rounded'>
            <div className="modal-content">
              <span className="close" onClick={onClose}>&times;</span>
              <h2 className='text-blue-400 font-bold text-xl'>Congratulations!</h2>
              <p>You have successfully verified your OTP.</p>
              <button className='bg-gray-200 py-3 w-[25rem] rounded-3xl mt-3 font-bold text-gray-600' onClick={onClose}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CongratulationModal;
