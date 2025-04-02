import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy';
import Homepage from './Homepage';
import AskaQuestion from './AskaQuestion';
import AddContribution from './AddContribution';
import Answers from './Answers';
import Welcome from './Welcome';
import SignUp from './Sign-Up';
import TopBar from './TopBar'; // You'll need to create this component
import { AuthProvider } from './context/AuthContext'; // Assuming you have an auth context

// This component will conditionally render the TopBar
function Layout() {
  const location = useLocation();
  const showTopBar = !['/', '/sign-up'].includes(location.pathname);
  
  return (
    <>
      {showTopBar && <TopBar />}
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/ask" element={<AskaQuestion />} />
        <Route path="/add-contribution" element={<AddContribution />} />
        <Route path="/answers" element={<Answers />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CssVarsProvider>
      
      <Router>
      <AuthProvider>
        <Routes>
       
          <Route path="/" element={<Welcome />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/*" element={<Layout />} />
          
        </Routes>
        </AuthProvider>
      </Router>
   
    </CssVarsProvider>
  );
}

export default App;