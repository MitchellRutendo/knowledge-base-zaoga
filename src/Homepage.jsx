import React, { useState, useEffect } from 'react';
import './homepage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Homepage() {
  const [user, setUser] = useState(null);

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem('userEmail'); // Get the email from localStorage
        if (email) {
          const response = await axios.get(`http://localhost:8081/user?email=${email}`);
          if (response.status === 200) {
            setUser(response.data); // Set the user details in state
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, []);

  // Function to get initials from the full name
  const getInitials = (fullname) => {
    if (!fullname) return '';
    const names = fullname.split(' ');
    return names.map((name) => name[0]).join('').toUpperCase();
  };

  return (
    <div className="container">
      {/* Welcome Section */}
      <h1 className="welcome-text">
        Hello {user ? user.fullname : 'Mitchel'}, welcome to ZAOGA FIF Knowledge Base
      </h1>

      {/* Logged-in User Icon */}
      {user && (
        <div className="user-icon" title={`${user.fullname} is logged in using email address ${user.email}`}>
          {getInitials(user.fullname)}
        </div>
      )}

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