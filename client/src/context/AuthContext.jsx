import React, { createContext, useState } from 'react';
import { users } from '../data/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (name, email, password, role) => {
    // Simulate registration by checking if email is unique
    if (users.some(u => u.email === email)) {
      return false; // Email already exists
    }
    const newUser = {
      id: users.length + 1,
      name,
      email,
      role,
      password,
      enrolledPrograms: role === 'Студент' ? [1] : [],
      teachingPrograms: role === 'Преподаватель' ? [1] : [],
      managedPrograms: role === 'Администратор' ? [1, 2] : [],
    };
    users.push(newUser); // Add to mock database
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};