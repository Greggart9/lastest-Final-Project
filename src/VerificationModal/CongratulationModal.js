import React from 'react';

function CongratulationModal({ isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-10 rounded'>
            <div className="modal-content flex flex-col justify-items-center items-center ">
              <span className="close" onClick={onClose}>&times;</span>
              <h2 className='text-blue-400 font-bold text-xl'>Congratulations!</h2>
              <img className='h-32 py-3' src='/Images/tick.png' alt='tick logo' />
              <p className='text-gray-600'>Your account has been created</p>
              <button className='bg-blue-400 py-3 w-[20rem] rounded-3xl mt-3 font-bold text-white' onClick={onClose}>Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CongratulationModal;
