
import './App.css';
import Landing from './LandingPage/Landing';
import Signin from './Signin/Signin'
import Signup from './Signup/Signup'
import Signup2 from './Signup2/Signup2';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import { useState } from 'react';


function App() {


    // const [showDashboard, setShowDashboard] = useState(false);
    // const handleDashboardVisibility = () => {
    //   setShowDashboard(true);
    // }



  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route element={<Landing/>} path='/'/>
          <Route element={<Signin/>} path='/Signin'/>
          <Route element={<Signup/>} path='/Signup'/>
          <Route element={<Signup2/>} path='/Signup2'/>
          
        </Routes>
        {/* { showDashboard && <Dboard/>}  */}
      </BrowserRouter>
    
    </>

  )
}

export default App;
