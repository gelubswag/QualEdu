import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DataUploadPage from './pages/DataUploadPage';
import DataAnalysisPage from './pages/DataAnalysisPage';
import ReportsPage from './pages/ReportsPage';
import FeedbackPage from './pages/FeedbackPage';
import { getCurrentUser } from './database';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container" style={{ paddingTop: user ? '80px' : '0' }}>
          <Routes>
            <Route 
              path="/" 
              element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <RegisterPage />} 
            />
            <Route 
              path="/upload" 
              element={user ? <DataUploadPage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analysis" 
              element={user ? <DataAnalysisPage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={user ? <ReportsPage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/feedback" 
              element={user ? <FeedbackPage user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;