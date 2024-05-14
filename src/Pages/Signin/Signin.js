import React from 'react'
import {Link} from 'react-router-dom'

const Signin = () => {
  return (
    <>
    <section className='flex h-screen justify-center items-center'>
      <div className='flex w-full'>

        {/* SIGNIN PART */}
        <div className='w-3/5 flex flex-col justify-center items-center'>
          <div>
            <p className='text-blue-400 font-bold text-3xl'>Sign In</p>

                <p className='text-gray-400 mt-3 text-md font-bold'>Email</p>
                <input className='bg-gray-200 h-10 w-[21rem] rounded outline-gray-400' type='email' id='email' name='email' />

                <p className='text-gray-400 mt-2 text-md font-bold'>Password</p>
                <input className='bg-gray-200 h-10 w-[21rem] rounded outline-gray-400' type='password' id='password' name='password' />

                <p className='text-blue-400 font-bold mt-2'>Forgot Password?</p>

                <Link to='/Dashboard'><button className='bg-gray-200 py-3 w-[21rem] rounded-3xl mt-3 font-bold text-gray-600 hover:bg-blue-400 hover:text-white'>Sign In</button></Link>

                <p className='text-gray-400 text-sm font-bold mt-1'>Don't have an Account? <Link to='/Signup' ><span className='text-blue-400'>Sign Up</span></Link></p>
          </div>
         </div>

        {/* IMAGE */}

        <div className='w-2/5 flex justify-end'>
            <img className='h-screen justify-left w-11/12' src='/Images/img11.png' alt='sign in' />

        </div>

        </div>

    </section>
    
    </>
  )
}

export default Signin