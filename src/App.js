
import './App.css';
import Landing from './Pages/LandingPage/Landing';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Signup2 from './Pages/Signup2/Signup2';
import Dashboard from './Pages/Dashboard/Dashboard';
import Collegeboard from './Pages/Dashboard/Collegeboard';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
// import { useState } from 'react';


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
          <Route element={<Dashboard/>} path='/Dashboard'/>
          <Route element={<Collegeboard/>} path='/Collegeboard'/>
          
          
        </Routes>
        {/* { showDashboard && <Dashboard/>}  */}
      </BrowserRouter>
    
    </>

  )
}

export default App;
