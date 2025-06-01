import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getFeedbacks, addFeedback } from '../database';

const FeedbackPage = ({ user }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState({
    discipline: '',
    rating: 5,
    comment: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksData = await getFeedbacks();
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newFeedback.discipline || !newFeedback.comment) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const feedbackToAdd = {
        ...newFeedback,
        teacher: user.role === 'teacher' ? user.name : 'Преподаватель неизвестен',
        student: user.role === 'student' ? user.name : 'Анонимный пользователь',
      };
      
      const addedFeedback = await addFeedback(feedbackToAdd);
      setFeedbacks(prev => [...prev, addedFeedback]);
      setSuccess(true);
      
      // Сброс формы
      setNewFeedback({
        discipline: '',
        rating: 5,
        comment: '',
      });
      
      // Скрыть сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при отправке отзыва');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentLabel = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'Положительный';
      case 'neutral': return 'Нейтральный';
      case 'negative': return 'Отрицательный';
      default: return 'Не определен';
    }
  };

  const getSentimentClass = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'sentiment-positive';
      case 'neutral': return 'sentiment-neutral';
      case 'negative': return 'sentiment-negative';
      default: return '';
    }
  };

  return (
    <div>
      <h1 className="page-title">Обратная связь</h1>
      
      {user.role === 'student' && (
        <div className="card">
          <h3 className="card-title">Оставить отзыв</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Дисциплина</label>
              <select
                className="form-control"
                name="discipline"
                value={newFeedback.discipline}
                onChange={handleInputChange}
                required
              >
                <option value="">Выберите дисциплину</option>
                <option value="Математика">Математика</option>
                <option value="Физика">Физика</option>
                <option value="Информатика">Информатика</option>
                <option value="История">История</option>
                <option value="Английский язык">Английский язык</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Оценка</label>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="star">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={parseInt(newFeedback.rating) === star}
                      onChange={handleInputChange}
                    />
                    <span className="star-icon">★</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Комментарий</label>
              <textarea
                className="form-control"
                name="comment"
                value={newFeedback.comment}
                onChange={handleInputChange}
                rows="4"
                placeholder="Ваш отзыв о дисциплине..."
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </div>
          </form>
          
          {success && (
            <div className="success-message">
              Ваш отзыв успешно отправлен! Спасибо за обратную связь.
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
      
      <div className="card">
        <h3 className="card-title">История отзывов</h3>
        
        {loading ? (
          <div>Загрузка отзывов...</div>
        ) : feedbacks.length === 0 ? (
          <div>Нет отзывов для отображения</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Дисциплина</th>
                  <th>Преподаватель</th>
                  <th>Студент</th>
                  <th>Оценка</th>
                  <th>Тональность</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>{feedback.discipline}</td>
                    <td>{feedback.teacher}</td>
                    <td>{feedback.student}</td>
                    <td>
                      <div className="rating-display">
                        {'★'.repeat(feedback.rating)}
                        {'☆'.repeat(5 - feedback.rating)}
                      </div>
                    </td>
                    <td>
                      <span className={`sentiment-badge ${getSentimentClass(feedback.sentiment)}`}>
                        {getSentimentLabel(feedback.sentiment)}
                      </span>
                    </td>
                    <td>{feedback.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .rating {
          display: flex;
          gap: 5px;
        }
        
        .star input {
          display: none;
        }
        
        .star-icon {
          font-size: 24px;
          color: #ddd;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .star input:checked ~ .star-icon,
        .star:hover .star-icon {
          color: #f1c40f;
        }
        
        .rating-display {
          color: #f1c40f;
          font-size: 18px;
        }
        
        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
        }
        
        .error-message {
          color: #e74c3c;
          margin-top: 15px;
        }
        
        .sentiment-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .sentiment-positive {
          background: #d4edda;
          color: #155724;
        }
        
        .sentiment-neutral {
          background: #fff3cd;
          color: #856404;
        }
        
        .sentiment-negative {
          background: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;