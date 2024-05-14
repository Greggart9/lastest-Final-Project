import React from 'react'
import Dashboard from './Dashboard'
import {Link} from 'react-router-dom'



const FormalMethod = ({showDashboard}) => {
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
                        <Link to='/Collegeboard'><span className='hover:text-blue-400'> &gt; Dashboard </span></Link>
                        <Link to='/Colphysdept'><span className='hover:text-blue-400'> &gt; Departments </span></Link>
                        <Link to='/Level'><span className='hover:text-blue-400'> &gt; Level </span></Link>
                        <Link to='/Fourhundred'><span className='hover:text-blue-400'> &gt; 400L </span></Link>
                        <span className='text-blue-400 cursor-pointer'> &gt; Formal Methods </span>
                        </p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex justify-between py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>400L Courses</p>

                    <span className='flex items-center gap-3'>
                    <span className='flex items-center bg-gray-100 p-1 rounded w-[15rem]'>
                    <img className='h-4 px-2' src='Images/icon7.png' alt='search logo' />
                    <input className='bg-transparent outline-none' type='search' id='search' placeholder='Search' />
                    </span>

                    <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img23.png' alt='' />
                            <p className='text-white font-medium text-sm'>Upload</p>
                            </span>
                    </button> 
                    </span>
                </section>

                {/* THE COLLEGES IN GRID FORMAT */}
                <section>
                    <div className='grid grid-cols-3 gap-4'>

                      {/* DIV 1 */}
        
                      <div className="bg-gray-100 flex flex-col justify-center items-center
                        text-center py-6 rounded">
                        <img className='h-16' src='Images\img16.png' alt='book logo' />
                        
                        <p className='text-gray-500 font-medium mt-2'>Architectural Design</p>
                        
                        <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img22.png' alt='' />
                            <p className='text-white font-medium text-sm'>Download</p>
                            </span></button>
                        
                      </div>


                      {/* DIV 2 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center
                        text-center py-6 rounded">
                        <img className='h-16' src='Images\img17.png' alt='book logo' />
                        
                        <p className='text-gray-500 font-medium mt-2'>Software Reuse</p>

                        <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img22.png' alt='' />
                            <p className='text-white font-medium text-sm'>Download</p>
                            </span></button> 
                      </div>

                      {/* DIV 3 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center
                        text-center py-6 rounded">
                        <img className='h-16' src='Images\img18.png' alt='book logo' />
                        
                        <p className='text-gray-500 font-medium mt-2'>Configuration Management</p>

                        <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img22.png' alt='' />
                            <p className='text-white font-medium text-sm'>Download</p>
                            </span>
                        </button> 
                        
                        
                      </div>

                      {/* DIV 4 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center
                        text-center py-6 rounded">
                        <img className='h-16' src='Images\img19.png' alt='book logo' />

                        <p className='text-gray-500 font-medium mt-2'>Formal Specification</p>

                        <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img22.png' alt='' />
                            <p className='text-white font-medium text-sm'>Download</p>
                            </span>
                        </button> 
                        
                      </div>

                      {/* DIV 5 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center
                        text-center py-6 rounded">
                        <img className='h-16' src='Images\img20.png' alt='book logo' />
                        <p className='text-gray-500 font-medium mt-2'>Z notation</p>
                        
                        <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img22.png' alt='' />
                            <p className='text-white font-medium text-sm'>Download</p>
                            </span>
                        </button>     
                      </div>

                      {/* DIV 6 */}
                      <div className="bg-gray-100 flex flex-col justify-center items-center
                        text-center py-6 rounded">
                        <img className='h-16' src='Images\img21.png' alt='funaab logo' />

                        <p className='text-gray-500 font-medium mt-2'>Formal Methods</p>

                        <button className='bg-blue-400 px-4 py-2 rounded-3xl mt-2'><span className='flex gap-2 items-center'>
                            <img className='h-4' src='Images\img22.png' alt='' />
                            <p className='text-white font-medium text-sm'>Download</p>
                            </span>
                        </button>
                        

                      </div>


                   </div>
                    
                </section>

        </div>


    </div>
    
    </>
  )
}

export default FormalMethod