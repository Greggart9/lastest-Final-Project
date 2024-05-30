import React from 'react'
import { Link } from 'react-router-dom'
import RegisterModal from './RegisterModal'
import { useState } from 'react'

const RegisterUni = () => {

    const [showModal, setShowModal] = useState(false);

    const handleUpdateClick = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  return (
    <>
    <section className='flex h-screen justify-center items-center'>
        <div className='flex w-full'>

            
            {/* IMAGE */}

            <div className='w-[25rem] flex'>
                <img className='h-screen justify-left w-[100rem]' src='/Images/img12.png' alt='sign up' />

            </div>

            {/* SIGN UP PART */}
            <div className='w-3/5 flex flex-col justify-center items-center'>
                <div>
                       {/* CREATE ACCOUNT  */}

                        <p className='text-blue-400 font-bold text-2xl'>Register New University</p>

                    
                         {/* NAME */}
                        <p className='text-gray-400 text-md font-medium mt-3'>University</p>
                        <input className='h-10 w-[23rem] rounded outline-gray-400 px-4 border border-gray-400 rounded mt-2' type='text' id='name' name='name' placeholder='Enter University Name' required />
                         
                          {/* SIGNIN */}
                        <div><button className='bg-gray-100 py-3 w-[23rem] rounded-3xl mt-5 font-bold text-gray-600  hover:bg-blue-400 hover:text-white' onClick={handleUpdateClick}>Register</button></div>
                         
                         {/* SIGNUP */}
                        <div className='w-[23rem] flex justify-center'><p className='text-gray-400 text-sm font-bold mt-1'>Already have an Account? <Link to='/Signin'> <span className='text-blue-400 cursor-pointer'>Sign In</span></Link></p></div>

                        <RegisterModal show={showModal} onClose={handleCloseModal} />
                </div>
            </div>

        </div>

    </section>
    
    </>
  )
}

export default RegisterUni