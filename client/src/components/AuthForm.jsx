import React, { useState } from 'react';

const AuthForm = ({ onSubmit, title, isRegister = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (isRegister && !formData.name) {
      setError('Пожалуйста, укажите ваше имя');
      return;
    }
    
    setError('');
    onSubmit(formData);
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="card-title" style={{ textAlign: 'center' }}>{title}</h2>
      
      {error && <div className="error-message" style={{ color: '#e74c3c', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label className="form-label">ФИО</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
            />
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
          />
        </div>
        
        {isRegister && (
          <div className="form-group">
            <label className="form-label">Роль</label>
            <select
              className="form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Студент</option>
              <option value="teacher">Преподаватель</option>
              <option value="quality">Методист</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
        )}
        
        <div className="form-group">
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;