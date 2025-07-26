import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const signup = async (email, password, role) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name: 'New User',
        email,
        password, // 
        role: role || 'user',
        department: '',
        salary: 0,
        joiningDate: new Date().toISOString().split('T')[0],
        position: ''
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const login = async (email, password) => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      department: 'Engineering',
      salary: 75000,
      joiningDate: '2023-01-15',
      position: 'Senior Developer'
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/'); 
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
