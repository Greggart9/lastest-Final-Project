import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import VerificationModal from '../VerificationModal/VerificationModal'
import CongratulationModal from '../VerificationModal/CongratulationModal'

const Signup2 = () => {
    const [showCongratulationModal, setShowCongratulationModal] = useState(false);
     
       const [showModal, setShowModal] = useState(false);

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

    
        <section className='flex h-screen justify-center items-center'>
        <div className='flex w-full'>

            
            {/* IMAGE */}

            <div className='w-2/5 flex'>
                <img className='h-screen justify-left w-10/12' src='/Images/img12.png' alt='sign up' />

            </div>

            {/* SIGN UP PART */}
            <div className='w-3/5 flex flex-col justify-center items-center'>
                <div>
                       {/* CREATE ACCOUNT  */}

                        <p className='text-blue-400 font-bold text-3xl'>Create Account</p>

                        <div className='flex flex-col'>
                            <div className='flex gap-2'>
                                <p className='border-[0.2rem] w-[11rem] border-gray-200 mt-3 rounded'></p>
                                <p className='border-[0.2rem] w-[11rem] border-blue-400 mt-3 rounded'></p> 
                            </div>
                            <p className='text-sm text-gray-400 flex mt-1 pr-2 justify-end'>2 of 2</p>
                        </div>

                    
                         {/* UNIVERSITY */}
                        <p className='text-gray-400 text-sm'>University</p>

                        <select className='mt-1 h-10 w-[23rem] border border-gray rounded outline-gray-400 '>
                            <option></option>
                            <option>Federal University of Agriculture Abeokuta</option>
                            <option>Harvard Law University</option>
                            <option>Columbia Law University</option>
                            <option>Greggart9 Art University</option>
                        </select>
                          
                         {/* COLLEGE/FACULTY */}
                        <p className='text-gray-400 mt-3 text-sm '>College/Faculty</p>
                        
                        <select className=' mt-1 h-10 w-[23rem] rounded border border-gray outline-gray-400 '>
                            <option></option>
                            <option>COLPHYS</option>
                            <option>COLPHEC</option>
                            <option>COLENG</option>
                            <option>COPLANT</option>
                        </select>


                         {/* DEPARTMENT */}
                        <p className='text-gray-400 mt-3 text-sm'>Department</p>

                        <select className=' mt-1 h-10 w-[23rem] rounded border border-gray outline-gray-400 '>
                            <option></option>
                            <option>COMPUTER SCIENCE</option>
                            <option>CHEMISTRY</option>
                            <option>PHYSICS</option>
                            <option>STATISTICS</option>
                            <option></option>
                        </select>

                         
                        {/* ACADEMIC LEVEL*/}
                        <p className='text-gray-400 mt-3 text-sm'>Academic Level</p>

                        <select className=' mt-1 h-10 w-[23rem] rounded border border-gray outline-gray-400 '>
                            <option></option>
                            <option>100 Level</option>
                            <option>200 Level</option>
                            <option>300 Level</option>
                            <option>400 Level</option>
                        </select><br/>

                         
                          {/* SIGNIN */}
                        <button onClick={handleSignUp} className='bg-gray-100 py-3 w-[23rem] rounded-3xl mt-3 font-bold text-gray-600 hover:bg-blue-400 hover:text-white'  >Sign Up</button>
                         
                         {/* SIGNUP */}
                        <p className='text-gray-400 text-sm font-bold mt-1'>Already have an Account? <Link to='/Signin'><span className='text-blue-400 cursor-pointer'>Sign In</span></Link></p>
                </div>
            </div>

        </div>

    </section>

    {/* Modal Component */}
    <VerificationModal isOpen={showModal} onClose={handleCloseModal} handleVerify={handleVerify} />

    {/* Congratulations Modal */}
    <CongratulationModal isOpen={showCongratulationModal} />
    </>
    
  )
}

export default Signup2

