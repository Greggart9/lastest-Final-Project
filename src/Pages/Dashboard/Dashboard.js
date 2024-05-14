import React from 'react'
import {Link} from 'react-router-dom'

const Dashboard = () => {
  return (
    <>
    <section className='bg-cyan-900 p-5 h-screen w-[13rem] text-white flex flex-col justify-between items-center'>

        <div className='mb-5 flex flex-col justify-between items-center'>
            <img src='Images\funaab.png' alt='funaab logo' />

            <Link to='/Collegeboard'><div className='flex items-center gap-3 h-[1.3rem] mt-5 hover:bg-blue-400 p-5 rounded active:bg-violet-700 cursor-pointer '>
            <img src='\Images\dashboard.png' alt='dashboard logo'/> <p>Dashboard</p>    
            </div></Link>

            <Link to='/Settings'><div className=' flex gap-3 mt-5 items-center h-[1.5rem] hover:bg-blue-400 p-5 rounded active:bg-violet-700 cursor-pointer'>
            <img src='\Images\settings.png' alt='settings logo'/> <p>Settings</p>    
            </div></Link>
        </div>


        <div className='flex items-center gap-3 h-[1.3rem] mt-5 cursor-pointer hover:bg-blue-400 p-5 rounded active:bg-violet-700 cursor-pointer'>
        <img src='\Images\logout.png' alt='logout logo'/> <p>Logout</p>    
        </div>

    </section>
    </>
  )
}

export default Dashboard