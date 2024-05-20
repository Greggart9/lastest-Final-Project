import React from 'react'
import Dashboard from '../Dashboard/Dashboard'
import {Link} from 'react-router-dom'



const Settings = ({showDashboard}) => {
  return (
    <>
    <div className=' flex justify-end'>

      <div className='fixed top-0 left-0 h-full overflow-y-auto '>
         { showDashboard && <Dashboard/>}
      </div>

        <div className='w-[79%] m-10'>
                {/* HOME> DASHBOARD> .... AND NOTIFICATION */}
                <section className='w-100 flex justify-between pb-5 items-center'>
                    <p className='font-medium text-gray-800'>Home
                        <span className='text-blue-400 cursor-pointer'> &gt; Settings </span>
                        </p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>Settings</p>
                </section>

                {/* THE SEETINGS */}
                <section className='flex flex-col gap-6'>
                      
                      {/* MANAGE PROFILE */}

                    <Link to='/Manageprofile'><div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4 '>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-600 font-medium'>Manage Profile</p>
                        </div>
                        <div>
                            &gt;
                        </div>
                    </div></Link>

                    {/* UPDATE PASSWORD */}
                      
                    <Link to='/UpdatePw'><div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img25.png' alt='profile logo' />
                            <p className='text-gray-600 font-medium'>Update Password</p>
                        </div>
                        <div>
                            &gt;
                        </div>
                    </div></Link>
                    
                    
                </section>

        </div>


    </div>
    
    </>
  )
}

export default Settings