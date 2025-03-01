import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Homepage from './Homepage';
import AskaQuestion from './AskaQuestion';
import AddContribution from './AddContribution';
import Answers from './Answers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/ask" element={<AskaQuestion />} />
        <Route path="/add-contribution" element={<AddContribution />} />
        <Route path="/answers" element={<Answers />} />
      </Routes>

      {/* Navigation example (Optional) */}
      <nav>
        <Link to="/">Home</Link> | <Link to="/ask">Ask a Question</Link> | <Link to="/add-contribution">Add Contribution</Link> | <Link to="/answers">Answers</Link>
      </nav>
    </Router>
  );
}

export default App;