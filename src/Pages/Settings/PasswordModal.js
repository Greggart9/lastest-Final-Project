import React from 'react';
import {Link} from 'react-router-dom'

function PasswordModal({ show, onClose })  {

  if(!show) return null;

  return (
    <div>
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-10 rounded'>
            <div className="modal-content flex flex-col justify-items-center items-center ">
              <span className="w-full flex justify-end text-blue-400 font-medium cursor-pointer" onClick={onClose}>Close</span>
              <h2 className='text-blue-400 font-bold text-xl'>Congratulations!</h2>
              <img className='h-32 py-3' src='/Images/tick.png' alt='tick logo' />
              <p className='text-gray-600 font-medium'>Your password has been updated</p>
              <Link to='/Settings' ><button className='bg-blue-400 py-3 w-[20rem] rounded-3xl mt-3 font-bold text-white' onClick={onClose}>Proceed</button></Link>
            </div>
          </div>
        </div>
    </div>
  );
}

export default  PasswordModal;
