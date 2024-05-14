
import './App.css';
import Landing from './Pages/LandingPage/Landing';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Signup2 from './Pages/Signup2/Signup2';
import Dashboard from './Pages/Dashboard/Dashboard';
import Collegeboard from './Pages/Dashboard/Collegeboard';
import Fourhundred from './Pages/Dashboard/Fourhundred';
import FormalMethod from './Pages/Dashboard/FormalMethod';
import Colphysdept from './Pages/Dashboard/Colphysdept';
import Level from './Pages/Dashboard/Level';
import Settings from './Pages/Settings/Settings';
import Manageprofile from './Pages/Settings/Manageprofile';
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
          <Route element={<Fourhundred showDashboard={showDashboard} />} path='/Fourhundred' />
          <Route element={<FormalMethod showDashboard={showDashboard} />} path='/FormalMethod' />
          <Route element={<Level showDashboard={showDashboard} />} path='/Level'/>
          <Route element={<Settings showDashboard={showDashboard} />} path='/Settings' />
          <Route element={<Manageprofile showDashboard={showDashboard} />} path='/Manageprofile' />
          
        </Routes>
      </BrowserRouter>
    
    </>

  )
}

export default App;
