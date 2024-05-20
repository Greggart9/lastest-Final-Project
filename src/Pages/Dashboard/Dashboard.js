import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // State to keep track of the active button
  const [activeButton, setActiveButton] = useState(null);

  // Function to handle button click
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <section className='bg-cyan-900 p-5 h-screen w-[13rem] text-white flex flex-col justify-between items-center'>
        <div className='mb-5 flex flex-col justify-between items-center'>
          <img src='Images/funaab.png' alt='funaab logo' />

           
           {/* DASHBOARD */}
          <div 
            className={`flex items-center gap-3 h-[1.3rem] mt-5 p-5 rounded cursor-pointer ${activeButton === 'Dashboard' ? 'bg-blue-400' : 'hover:bg-blue-400 '}`}
            onClick={() => handleButtonClick('Dashboard')}
          >
            <Link to='/Collegeboard' className='flex items-center gap-3 w-full'>
              <img src='Images/dashboard.png' alt='dashboard logo' /> 
              <p>Dashboard</p>
            </Link>
          </div>
 
           {/* SETTINGS */}
          <div 
            className={`flex items-center gap-3 h-[1.5rem] mt-5 p-5 rounded cursor-pointer ${activeButton === 'Settings' ? 'bg-blue-400' : 'hover:bg-blue-400 '}`}
            onClick={() => handleButtonClick('Settings')}
          >
            <Link to='/Settings' className='flex items-center gap-3 w-full'>
              <img src='Images/settings.png' alt='settings logo' /> 
              <p>Settings</p>
            </Link>
          </div>
        </div>
           

           {/* LOGOUT */}
        <div 
          className={`flex items-center gap-3 h-[1.3rem] mt-5 p-5 rounded cursor-pointer ${activeButton === 'Logout' ? 'bg-blue-400' : 'hover:bg-blue-400 '}`}
          onClick={() => handleButtonClick('Logout')}
        >
          <img src='Images/logout.png' alt='logout logo' /> 
          <p>Logout</p>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
