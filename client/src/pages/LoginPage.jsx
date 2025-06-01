import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { authenticateUser } from '../database';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const user = await authenticateUser(formData.email, formData.password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthForm 
        onSubmit={handleLogin} 
        title="Вход в систему" 
        isRegister={false} 
      />
      
      <div className="text-center mt-3">
        <p>
          Нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </p>
      </div>
      
      {loading && <div className="text-center">Проверка данных...</div>}
      {error && <div className="text-center error-message">{error}</div>}
    </div>
  );
};

export default LoginPage;