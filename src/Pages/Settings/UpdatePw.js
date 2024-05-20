
import Dashboard from '../Dashboard/Dashboard'
import {Link} from 'react-router-dom'
import PasswordModal from './PasswordModal'
import { useState } from 'react'



const UpdatePw = ({showDashboard}) => {

    const [showModal, setShowModal] = useState(false);

    const handleUpdateClick = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };

    
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
                    <Link to='/Settings'><span className='hover:text-blue-400'> &gt; Settings </span></Link>
                        <span className='text-blue-400 cursor-pointer'> &gt; Update Password </span>
                        </p>

                    <img className='' src='images/icon6.png' alt='notification logo' />
                </section>

                {/* DASHBOARD AND SEARCH BOX */}
                <section className='w-100 flex py-5 items-center'>
                    <p className='font-bold text-blue-400 text-xl'>Update Password</p>
                </section>

                {/* THE SETTINGS */}
                <section className='flex flex-col gap-6 border border-gray-400 p-8 rounded'>
                     
                     {/* CURRENT PW */}
                    <div>
                        <p className='font-medium text-gray-400'>Current Password</p>
                        <div className='flex justify-between items-center bg-gray-50 border border-gray-400 mt-2 px-4  rounded'>
                        <input className='py-4  w-[40rem] bg-transparent outline-none' type='password' id='password' placeholder='Enter Current Password' required />
                        <img className='h-4 pr-5 cursor-pointer' src='images/img26.png' alt='password icon'/>
                        </div>
                    </div>

                     {/* NEW PW */}
                    <div>
                        <p className='font-medium text-gray-400'>New Password</p>
                        <div className='flex justify-between items-center bg-gray-50 border border-gray-400 mt-2 px-4 rounded'>
                        <input className='py-4  w-[40rem] bg-transparent outline-none' type='password' id='password' placeholder='Enter New Password' required />
                        <img className='h-4 pr-5 cursor-pointer' src='images/img26.png' alt='password icon'/>
                        </div>
                    </div>

                     {/* RE-ENTER NEW PW */}
                    <div>
                        <p className='font-medium text-gray-400'> Re-enter New Password</p>
                        <div className='flex justify-between items-center bg-gray-50 border border-gray-400 mt-2 px-4 rounded'>
                        <input className='py-4  w-[40rem] bg-transparent outline-none' type='password' id='password' placeholder='Confirm New Password' required />
                        <img className='h-4 pr-5 cursor-pointer' src='images/img26.png' alt='password icon'/>
                        </div>
                    </div>


                    {/* BUTTON */}
                    <div className='flex justify-end'>
                        <button onClick={handleUpdateClick} className='text-gray-600 font-medium bg-gray-200 rounded-3xl w-[10rem] py-3 px-10'>Update</button>
                    </div>

                    <PasswordModal show={showModal} onClose={handleCloseModal} />

                 





                                         
                </section>

        </div>


    </div>
    
    </>
  )
}

export default UpdatePw