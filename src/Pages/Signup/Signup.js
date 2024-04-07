import React from 'react'
import {Link} from 'react-router-dom'

const Signup = () => {
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
                                <p className='border-[0.2rem] w-[11rem] border-blue-400 mt-3 rounded'></p>
                                <p className='border-[0.2rem] w-[11rem] border-gray-200 mt-3 rounded'></p> 
                            </div>
                            <p className='text-sm text-gray-400 flex mt-1 pr-2 justify-end'>1 of 2</p>
                        </div>

                    
                         {/* NAME */}
                        <p className='text-gray-400 text-md font-bold'>Name</p>
                        <input className='bg-gray-100 h-10 w-[23rem] rounded outline-gray-400' type='text' id='name' name='name' required />
                          
                         {/* EMAIL */}
                        <p className='text-gray-400 mt-1 text-md font-bold'>Email</p>
                        <input className='bg-gray-100 h-10 w-[23rem] rounded outline-gray-400  px-4' type='email' id='email' name='email' />

                        {/* ROLE */}
                        <div className=''>
                            

                        </div>

                         {/* PASSWORD */}
                        <p className='text-gray-400 mt-1 text-md font-bold'>Password</p>
                        <input className='bg-gray-100 h-10 w-[23rem] rounded outline-gray-400' type='password' id='password' name='password' />
                         
                        {/* COFNFIRM PASSWORD */}
                        <p className='text-gray-400 mt-1 text-md font-bold'>Confirm Password</p>
                        <input className='bg-gray-100 h-10 w-[23rem] rounded outline-gray-400' type='confirmpassword' id='confirmpassword' name='confirmpassword' />
                         
                          {/* FORGOT PASSWORD */}
                        <p className='text-blue-400 font-bold mt-2 cursor-pointer'>Forgot Password?</p>
                         
                          {/* SIGNIN */}
                        <Link to='/Signup2' ><button className='bg-gray-100 py-3 w-[23rem] rounded-3xl mt-3 font-bold text-gray-600  hover:bg-blue-400 hover:text-white'>Next</button></Link>
                         
                         {/* SIGNUP */}
                        <p className='text-gray-400 text-sm font-bold mt-1'>Already have an Account? <Link to='/Signin'> <span className='text-blue-400 cursor-pointer'>Sign In</span></Link></p>
                </div>
            </div>

        </div>

    </section>
    
    </>
  )
}

export default Signup 