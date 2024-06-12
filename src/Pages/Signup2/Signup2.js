import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VerificationModal from '../VerificationModal/VerificationModal'
import CongratulationModal from '../VerificationModal/CongratulationModal'

const Signup2 = () => {
    const [showCongratulationModal, setShowCongratulationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);  
    const [loading, setLoading] = useState(false);

    const handleVerify = () => {
      // Perform verification logic
      // If verification is successful, show the congratulations modal
      setShowCongratulationModal(true);
    };


    const handleSignUp = () => {
      // Perform signup logic
      // Once signup is successful, show the verification modal
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

      <img className='lg:w-[40rem] md:w-[45rem] h-screen' src='/Images/img10.png' alt='' />

    </div>

    {/* RIGHT HAND */}


     <div className=' h-screen lg:w-[60rem] md:w-[55rem] w-[80rem] flex justify-center items-center relative'>

      <div className='p-3 bg-white md:bg-none md:bg-transparent rounded'>
                        
          {/* CREATE ACCOUNT  */}

        <div className='space-y-1 md:space-y-1'>
          <p className='text-blue-400 font-bold md:text-left text-center md:text-3xl text-2xl'>Create Account</p>

          <div className='flex flex-col'>
              <div className='flex gap-2'>
                  <p className='border-[0.2rem] lg:w-[14.5rem] md:w-[12.5rem] w-[9rem] border-gray-400 mt-3 rounded'></p>
                  <p className='border-[0.2rem] lg:w-[15rem] md:w-[12.5rem]  w-[9rem] border-blue-400 mt-3 rounded'></p> 
              </div>
          </div>
          <p className='text-sm text-gray-400 font-bold flex  pr-2 justify-end'>2 of 2</p>
        </div>



        {/* SIGN UP PART */}
        <form className=' flex flex-col justify-center items-center lg:space-y-2 space-y-1'>

        {/* UNIVERSITY */}
        <div className='space-y-1 items-start'>
          <label htmlFor='university' className='text-gray-400 text-sm md:text-[1.1rem] font-medium '>University</label><br />
          <select
            className='bg-gray-100 h-10 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
            id='university'
            name='university'
            required
          >
            <option className='' value="" disabled selected>Select your university</option>
            <option value="university1">University 1</option>
            <option value="university2">University 2</option>
            <option value="university3">University 3</option>
            <option value="university4">University 4</option>
          </select>
        </div>

            {/* COLLEGE/FACULTY */}
          <div className='space-y-1 items-start'>
          <label htmlFor='college' className='text-gray-400 text-sm md:text-[1.1rem] font-medium'>College/Faculty</label><br />
          <select
            className='bg-gray-100 h-10 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
            id='university'
            name='university'
            required
          >
            <option value="" disabled selected>Select your college</option>
            <option value="college1">College 1</option>
            <option value="college2">College 2</option>
            <option value="college3">College 3</option>
            <option value="college4">College 4</option>
          </select>
        </div>

          {/* DEPARTMENT */}
          <div className='space-y-1 items-start'>
          <label htmlFor='department' className='text-gray-400 text-sm md:text-[1.1rem] font-medium'>Department</label><br />
          <select
            className='bg-gray-100 h-10 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
            id='university'
            name='university'
            required
          >
            <option value="" disabled selected>Select your department</option>
            <option value="department">Department 1</option>
            <option value="department2">Department 2</option>
            <option value="department3">Department 3</option>
            <option value="department4">Department 4</option>
          </select>
        </div>

          {/* ACADEMIC LEVEL */}
          <div className='space-y-1 items-start'>
          <label htmlFor='university' className='text-gray-400 text-sm md:text-[1.1rem] font-medium'>Academic level</label><br />
          <select
            className='bg-gray-100 h-10 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
            id='university'
            name='university'
            required
          >
            <option value="" disabled selected>Select your university</option>
            <option value="level1">100 Level</option>
            <option value="level2">200 Level</option>
            <option value="level3">300 Level</option>
            <option value="level4">400 Level</option>
          </select>
        </div>



          {/* SUBMIT BUTTON */}
          <Link to='/Signup2'><div className=''>
            <button type=''
            onClick={handleSignUp}  
            className='bg-gray-100 py-2 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded-3xl mt-3 font-bold text-gray-600  hover:bg-blue-400 hover:text-white'>
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </div></Link>

          {/* REGISTER NEW UNIVERSITY */}

          <Link to='/RegisterUni'><div><button className='border border-blue-400 py-2 lg:w-[30rem] md:w-[25rem] w-[17rem] 
           rounded-3xl mt-3 font-bold text-blue-400
          '>Register New University</button></div></Link>

                    {/* SIGNUP */}
                    <p className='text-gray-400 text-sm font-bold mt-1'>
            Already have an Account? <span className='text-blue-400 cursor-pointer'>Sign In</span></p>

        </form>

        
      </div>


     </div>
  
  </div>

</div>

    {/* Modal Component */}
    <VerificationModal isOpen={showModal} onClose={handleCloseModal} handleVerify={handleVerify} />

    {/* Congratulations Modal */}
    <CongratulationModal isOpen={showCongratulationModal} />
    </>
    
  )
}

export default Signup2

