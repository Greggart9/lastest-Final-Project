import React from 'react'
import Dashboard from './Dashboard'
import {Link} from 'react-router-dom'



const Fourhundred = ({showDashboard}) => {
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
                        <Link to='/Level'><span className='hover:text-blue-400'> > Level </span></Link>
                        <span className='text-blue-400 cursor-pointer'> > 400L </span>
                        </p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex justify-between py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>400L Courses</p>
                    <span className='flex items-center bg-gray-100 p-1 rounded w-[15rem]'>
                    <img className='h-4 px-2' src='Images/icon7.png' alt='search logo' />
                    <input className='bg-transparent outline-none' type='search' id='search' placeholder='Search' />
                    </span>
                    
                </section>

                {/* THE COLLEGES IN GRID FORMAT */}
                <section>
                    <div className='grid grid-cols-3 gap-4'>

                      {/* DIV 1 */}
                      <Link to='/FormalMethod'>
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img16.png' alt='book logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Formal Methods</p>
                        <p className='text-gray-500 font-medium'>(CSC 405)</p>
                      </div>
                      </Link>

                      {/* DIV 2 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img17.png' alt='book logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Database System</p>
                        <p className='text-gray-500 font-medium'>(CSC 407)</p>
                      </div>

                      {/* DIV 3 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img18.png' alt='book logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Object Oriented Programming</p>
                        <p className='text-gray-500 font-medium'>(CSC 403)</p>
                        
                      </div>

                      {/* DIV 4 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img19.png' alt='book logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Organization of Program. Lang.</p>
                        <p className='text-gray-500 font-medium'>(CSC 447)</p>
                        
                      </div>

                      {/* DIV 5 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img20.png' alt='book logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Logic Programming</p>
                        <p className='text-gray-500 font-medium'>(CSC 431)</p>     
                      </div>

                      {/* DIV 6 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img21.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>System Performance Evaluation</p>
                        <p className='text-gray-500 font-medium'>(CSC 439)</p>

                      </div>

                      {/* DIV 7 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img18.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Special Topics</p>
                        <p className='text-gray-500 font-medium'>(CSC 435)</p>
                        
                      </div>

                      {/* DIV 8 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center cursor-pointer
                        text-center py-4 rounded hover:-translate-y-3 transition-transform duration-300">
                        <img className='h-16' src='Images\img17.png' alt='funaab logo' />
                        <br/>
                        <p className='text-gray-500 font-medium'>Artificial Intelligence</p>
                        <p className='text-gray-500 font-medium'>(CSC 431)</p>
                        
                      </div>

                   </div>
                    
                </section>

        </div>


    </div>
    
    </>
  )
}

export default Fourhundred