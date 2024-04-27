
import './App.css';
import Landing from './Pages/LandingPage/Landing';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Signup2 from './Pages/Signup2/Signup2';
import Dashboard from './Pages/Dashboard/Dashboard';
import Collegeboard from './Pages/Dashboard/Collegeboard';
import Colphysdept from './Pages/Dashboard/Colphysdept';
import Level from './Pages/Dashboard/Level';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import { useState } from 'react';


function App() {


    const [showDashboard, setShowDashboard] = useState(true);


  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route element={<Landing/>} path='/'/>
          <Route element={<Signin/>} path='/Signin'/>
          <Route element={<Signup/>} path='/Signup'/>
          <Route element={<Signup2/>} path='/Signup2'/>
          <Route element={<Dashboard/>} path='/Dashboard'/>
          <Route element={<Collegeboard showDashboard={showDashboard} />} path='/Collegeboard' />
          <Route element={<Colphysdept showDashboard={showDashboard} />} path='/Colphysdept' />
          <Route element={<Level showDashboard={showDashboard} />} path='/Level' />
          
        </Routes>
      </BrowserRouter>
    
    </>

  )
}

export default App;
