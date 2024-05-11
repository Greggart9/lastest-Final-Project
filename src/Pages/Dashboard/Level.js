import React from 'react'
import Dashboard from './Dashboard'
import {Link} from 'react-router-dom'

const Level = ({showDashboard}) => {
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
                    <Link to='/Colphysdept'><span className='hover:text-blue-400'> > Departments </span></Link>
                    <span className='text-blue-400 cursor-pointer'> > Level </span>
                     </p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex justify-between py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>Levels</p>
                    <span className='flex items-center bg-gray-100 p-1 rounded w-[15rem]'>
                    <img className='h-4 px-2' src='Images/icon7.png' alt='search logo' />
                    <input className='bg-transparent outline-none' type='search' id='search' placeholder='Search' />
                    </span>
                    
                </section>

                {/* THE LEVELS IN GRID FORMAT */}
                <section>
                    <div className='grid grid-cols-2 gap-6'>

                      {/* DIV 1 */}
                      
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\img13.png' alt='100' />
                        
                        <p className='text-gray-500 font-medium mt-1'>100L</p>
                      </div>

                      {/* DIV 2 */}
                      <div className="bg-gray-100  flex flex-col justify-center items-center cursor-pointer
                        text-center  py-16 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\img4.png' alt='200' />
                       
                        <p className='text-gray-500 font-medium mt-1'>200L</p>
                      </div>

                      {/* DIV 3 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-16 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\img14.png' alt='300' />
                        
                        <p className='text-gray-500 font-medium mt-1'>300L</p>
                      </div>

                      {/* DIV 4 */}
                      <Link to='/Fourhundred'>
                        <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-16 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img src='Images\img15.png' alt='400' />
                        
                        <p className='text-gray-500 font-medium mt-1'>400L</p>
                      </div></Link>

                   </div>
                    
                </section>
        </div>
    </div>
    
    </>
    
  )
}

export default Level