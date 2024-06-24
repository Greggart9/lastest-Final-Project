import React from 'react';
import {Link} from 'react-router-dom'

function RegisterModal({ show, onClose })  {

  if(!show) return null;

  return (
    <div>
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white m-4 p-5 md:p-10 rounded'>
            <div className="modal-content flex flex-col justify-items-center items-center ">
              {/* <span className="w-full flex justify-end text-blue-400 font-medium cursor-pointer" onClick={onClose}>Close</span> */}
              <h2 className='text-yellow-400 font-bold text-xl'>Pending</h2>
              <img className='md:h-32 h-28 py-3' src='/Images/img27.png' alt='tick logo' />
              <div className='flex text-center md:w-[29rem] w-[]'>
                <p className='text-gray-600 font-medium '>The registered University will be approved by the admin and a message will be sent to your mail</p></div>
              <Link to='/Settings' ><button className='bg-blue-400 py-3 w-[18rem] md:w-[20rem] rounded-3xl mt-3 font-bold text-white' onClick={onClose}>Proceed</button></Link>
            </div>
          </div>
        </div>
    </div>
  );
}

export default RegisterModal;
