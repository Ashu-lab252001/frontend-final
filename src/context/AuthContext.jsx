import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const initializeAuthState = () => {
      const token = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('userName');
      setIsLoggedIn(Boolean(token));
      setUserName(storedUserName || '');
    };
    initializeAuthState();
  }, []);

  const login = (token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name);
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
  };

  const refreshAuthState = () => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    setIsLoggedIn(Boolean(token));
    setUserName(storedUserName || '');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
