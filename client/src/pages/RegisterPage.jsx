import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../database';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      await registerUser(formData);
      setSuccess(true);
      
      // Автоматический вход после регистрации
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="card-title">Регистрация завершена</h2>
        <p>Ваш аккаунт успешно создан. Сейчас вы будете перенаправлены на страницу входа.</p>
      </div>
    );
  }

  return (
    <div>
      <AuthForm 
        onSubmit={handleRegister} 
        title="Регистрация" 
        isRegister={true} 
      />
      
      <div className="text-center mt-3">
        <p>
          Уже есть аккаунт? <a href="/login">Войти</a>
        </p>
      </div>
      
      {loading && <div className="text-center">Регистрация...</div>}
      {error && <div className="text-center error-message">{error}</div>}
    </div>
  );
};

export default RegisterPage;