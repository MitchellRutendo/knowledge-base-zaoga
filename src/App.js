import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy';
import Homepage from './Homepage';
import AskaQuestion from './AskaQuestion';
import AddContribution from './AddContribution';
import Answers from './Answers';
import Welcome from './Welcome';
import SignUp from './Sign-Up';




function App() {
 

  

   
  return (
    <CssVarsProvider>
      <Router>
        
        
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/ask" element={<AskaQuestion />} />
            <Route path="/add-contribution" element={<AddContribution />} />
            <Route path="/answers" element={<Answers />} />
          </Routes>

          {/* Navigation example */}
          <nav>
            <Link to="/">Home</Link> | <Link to="/homepage">Homepage</Link> |{' '}
            <Link to="/ask">Ask a Question</Link> |{' '}
            <Link to="/add-contribution">Add Contribution</Link> |{' '}
            <Link to="/answers">Answers</Link>
          </nav>
        
      </Router>
    </CssVarsProvider>
  );
}

export default App;
