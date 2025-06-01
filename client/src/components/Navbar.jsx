import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'teacher': return 'Преподаватель';
      case 'student': return 'Студент';
      case 'quality': return 'Методист';
      default: return 'Пользователь';
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/">Система оценки качества</Link>
          </div>
          
          <div className="navbar-links">
            {user.role === 'admin' && (
              <>
                <Link to="/upload">Загрузка данных</Link>
                <Link to="/reports">Отчеты</Link>
              </>
            )}
            
            {(user.role === 'admin' || user.role === 'quality') && (
              <Link to="/analysis">Анализ данных</Link>
            )}
            
            <Link to="/feedback">Обратная связь</Link>
          </div>
          
          <div className="navbar-user">
            <span>{user.name}</span>
            <span className="user-role">({getRoleName(user.role)})</span>
            <button onClick={onLogout} className="btn btn-primary">Выйти</button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #2c3e50;
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 15px 0;
        }
        
        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .navbar-brand a {
          color: white;
          font-size: 20px;
          font-weight: 700;
          text-decoration: none;
        }
        
        .navbar-links {
          display: flex;
          gap: 20px;
        }
        
        .navbar-links a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        
        .navbar-links a:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
        }
        
        .user-role {
          font-size: 14px;
          opacity: 0.8;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;