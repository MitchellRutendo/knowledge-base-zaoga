import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Redirect after login if needed
    navigate('/homepage', { replace: true });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Call your backend logout endpoint
    fetch('http://localhost:8081/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    navigate('/', { replace: true });
  };

  // Check for existing session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}