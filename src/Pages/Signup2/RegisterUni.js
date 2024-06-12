import React from 'react'
import { Link } from 'react-router-dom'
import RegisterModal from './RegisterModal'
import { useState } from 'react'

const RegisterUni = () => {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleUpdateClick = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  return (
    <>
      <div >

      <div className='fixed h-screen w-screen md:hidden bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>

      </div>

      <div className='h-screen w-screen fixed -z-10 md:hidden bg-cover bg-center' style={{ backgroundImage: `url('/Images/img10.png')` }}>

      </div>

      <div className='flex '>


          {/* /* LEFT HAND */}
          <div className='h-screen hidden md:block'>

            <img className='lg:w-[40rem] md:w-[50rem] h-screen' src='/Images/img10.png' alt='' />

          </div>

          {/* RIGHT HAND */}


          <div className=' h-screen lg:w-[60rem] md:w-[50rem] w-[70rem] flex justify-center items-center relative'>

            <div className='p-4 bg-white md:bg-none md:bg-transparent rounded'>

           {/* Register New University */}

             
                {/* UNIVERSITY NAME  */}
              <p className='text-blue-400 font-bold md:text-left text-center md:text-3xl text-2xl mb-2'>Register New University</p>

              <div className='flex flex-col justify-center items-center lg:space-y-3 space-y-1'>          
                {/* NAME */}
                <div className='space-y-1 items-start'>
                <label htmlFor='university' className='text-gray-400 font-medium text-left text-md md:text-xl'>University</label><br/>
                <input 
                className='bg-gray-100 h-11 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
                type='text' 
                id='name' 
                name='name' 
                placeholder='Enter University Name' 
                required />
                </div>
                              
                {/* REGISTER BUTTON */}
                
                <div >
                  <button 
                  type='submit' 
                  onClick={handleUpdateClick}
                  className='bg-gray-100 py-3 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded-3xl mt-3 font-bold text-gray-600  hover:bg-blue-400 hover:text-white'>
                    {loading ? 'Loading...' : 'Register'}
                  </button>
                </div>
                
                              
                {/* SIGNUP */}
                <p className='text-gray-400 text-sm font-bold mt-1'>
                  Already have an Account? <span className='text-blue-400 cursor-pointer'>Sign In</span></p>
            

                <RegisterModal show={showModal} onClose={handleCloseModal} />
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default RegisterUni