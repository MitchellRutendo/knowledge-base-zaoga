import React from 'react';
import './homepage.css'; 
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="container">
      {/* Welcome Section */}
      <h1 className="welcome-text">Welcome to ZAOGA FIF Knowledge Base</h1>

      {/* Assistance Section */}
      <p className="assist-text">How can we assist you today?</p>

      {/* Button Section */}
      <div className="button-container">
      <Link to="/ask">
        <button className="button ask-button">Ask a Question</button>
        </Link>
        <Link to="/add-contribution">
        <button className="button contribute-button">Add Contributions</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;