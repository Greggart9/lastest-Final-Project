import React from 'react'

const Collegeboard = () => {
  return (
    <>
    <div className='bg-cyan-100 flex justify-end'>

        <div className='w-[79%] m-8'>
                {/* HOME> DASHBOARD> .... AND NOTIFICATION */}
                <section className='w-100 flex justify-between pb-5 items-center'>
                    <p className='font-medium text-gray-800'>Home <span className='text-blue-400'> > Dashboard </span></p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex justify-between py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>Dashboard</p>
                    <span className='flex items-center bg-gray-100 p-1 rounded w-[15rem]'>
                    <img className='h-4 px-2' src='Images/icon7.png' alt='search logo' />
                    <input className='bg-transparent' type='search' id='search' placeholder='Search' />
                    </span>
                    
                </section>

                {/* THE COLLEGES IN GRID FORMAT */}
                <section>
                    
                </section>

        </div>


    </div>
    
    </>
  )
}

export default Collegeboard