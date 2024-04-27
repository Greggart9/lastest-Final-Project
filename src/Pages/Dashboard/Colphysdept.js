import React from 'react'
import Dashboard from './Dashboard'
import {Link} from 'react-router-dom'

const Colphysdept = ({showDashboard}) => {
  return (
    <>
    <div className='bg-yellow-100 flex justify-end'>

      <div className='fixed top-0 left-0 h-full overflow-y-auto '>
         { showDashboard && <Dashboard/>}
      </div>

        <div className='w-[79%] m-10'>
                {/* HOME> DASHBOARD> .... AND NOTIFICATION */}
                <section className='w-100 flex justify-between pb-5 items-center'>
                    <p className='font-medium text-gray-800'>Home
                    <Link to='/Collegeboard'><span className='hover:text-blue-400'> > Dashboard </span></Link>
                     <span className='text-blue-400'> > Departments </span></p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex justify-between py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>Departments</p>
                    <span className='flex items-center bg-gray-100 p-1 rounded w-[15rem]'>
                    <img className='h-4 px-2' src='Images/icon7.png' alt='search logo' />
                    <input className='bg-transparent outline-none' type='search' id='search' placeholder='Search' />
                    </span>
                    
                </section>

                {/* THE DEPARTMENTS IN GRID FORMAT */}
                <section>
                    <div className='grid grid-cols-3 gap-4'>

                      {/* DIV 1 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\funaab.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Computer Science</p>
                      </div>

                      {/* DIV 2 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\funaab.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Mathematics</p>
                      </div>

                      {/* DIV 3 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\funaab.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Statistics</p>
                      </div>

                      {/* DIV 4 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\funaab.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Chemistry</p>
                      </div>

                      {/* DIV 5 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\funaab.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Physics</p>
                      </div>

                   </div>
                    
                </section>
        </div>
    </div>
    
    </>
  )
}

export default Colphysdept