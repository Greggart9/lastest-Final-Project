import React from 'react'
import Dashboard from '../Dashboard/Dashboard'
import {Link} from 'react-router-dom'



const Manageprofile = ({showDashboard}) => {
  return (
    <>
    <div className='flex justify-end'>

      <div className='fixed top-0 left-0 h-full overflow-y-auto '>
         { showDashboard && <Dashboard/>}
      </div>

        <div className='w-[79%] m-10'>
                {/* HOME> DASHBOARD> .... AND NOTIFICATION */}
                <section className='w-100 flex justify-between pb-5 items-center'>
                    <p className='font-medium text-gray-800'>Home
                    <Link to='/Settings'><span className='hover:text-blue-400'> &gt; Settings </span></Link>
                        <span className='text-blue-400 cursor-pointer'> &gt; Manage Profile </span>
                        </p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>Manage Profile</p>
                </section>

                {/* THE SETTINGS */}
                <section className='flex flex-col gap-6'>
                      
                      {/* NAME */}

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>Name</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>Greggart9</p>
                        </div>
                    </div>

                    {/* EMAIL */}

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>Email</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>retrievergolden498@gmail.com</p>
                        </div>
                    </div>

                    {/* University */}

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>Funaab</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>retrievergolden498@gmail.com</p>
                        </div>
                    </div>

                    {/* ROLE */}

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>Role</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>Student</p>
                        </div>
                    </div>

                    {/* College/Faculty */}

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>College/Faculty</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>COLPHYS</p>
                        </div>
                    </div>

                    {/* DEPARTMENT */}

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>Department</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>Computer Science</p>
                        </div>
                    </div>

                    <div className='bg-gray-100 py-5 px-8 flex items-center justify-between cursor-pointer rounded'>
                        <div className='flex items-center gap-4'>
                            <img className='h-10' src='Images\img24.png' alt='profile logo' />
                            <p className='text-gray-400 font-medium'>Academic Level</p>
                        </div>
                        <div>
                            <p className='text-gray-400 font-medium'>400L</p>
                        </div>
                    </div>                    
                </section>

        </div>


    </div>
    
    </>
  )
}

export default Manageprofile