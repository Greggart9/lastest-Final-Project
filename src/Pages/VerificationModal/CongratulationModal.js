import React from 'react';
import {Link} from 'react-router-dom'

function CongratulationModal({ isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-5 md:p-10 rounded'>
            <div className="modal-content flex flex-col justify-items-center items-center ">
              <span className="close" onClick={onClose}>&times;</span>
              <h2 className='text-blue-400 font-bold text-xl'>Congratulations!</h2>
              <img className='h-32 py-3' src='/Images/tick.png' alt='tick logo' />
              <p className='text-gray-600'>Your account has been created</p>
              <Link to='/Dashboard' ><button className='bg-blue-400 py-3 w-[18rem] md:w-[20rem] rounded-3xl mt-3 font-bold text-white' onClick={onClose}>Proceed</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CongratulationModal;
