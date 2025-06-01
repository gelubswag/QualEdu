import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import DataTable from '../components/DataTable';
import { getAnalysisData } from '../database';

const DataAnalysisPage = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('semester');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analysisData = await getAnalysisData();
        setData(analysisData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="container">Загрузка данных анализа...</div>;
  }

  const pieData = {
    labels: ['Положительные', 'Нейтральные', 'Отрицательные'],
    values: [data.feedback.positive, data.feedback.neutral, data.feedback.negative],
  };

  return (
    <div>
      <h1 className="page-title">Анализ данных</h1>
      
      <div className="card">
        <div className="filters">
          <div className="form-group">
            <label className="form-label">Период анализа</label>
            <select 
              className="form-control"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="month">Последний месяц</option>
              <option value="quarter">Квартал</option>
              <option value="semester">Семестр</option>
              <option value="year">Год</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid">
        <BarChart 
          data={data.performance} 
          title="Успеваемость по дисциплинам" 
        />
        <BarChart 
          data={data.satisfaction} 
          title="Удовлетворенность студентов" 
        />
      </div>
      
      <div className="grid">
        <LineChart 
          data={data.trends} 
          title="Динамика успеваемости" 
        />
        <PieChart 
          data={pieData} 
          title="Анализ отзывов студентов" 
        />
      </div>
      
      <div className="card">
        <h3 className="card-title">Проблемные дисциплины</h3>
        <div className="problem-disciplines">
          <div className="discipline">
            <div className="discipline-name">Микроэкономика</div>
            <div className="discipline-score">65%</div>
            <div className="discipline-status low">Низкое качество</div>
          </div>
          <div className="discipline">
            <div className="discipline-name">История</div>
            <div className="discipline-score">72%</div>
            <div className="discipline-status medium">Среднее качество</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="card-title">Рекомендации по улучшению</h3>
        <ul className="recommendations">
          <li>Увеличить количество практических занятий по дисциплине "Микроэкономика"</li>
          <li>Организовать дополнительные консультации по дисциплине "История"</li>
          <li>Обновить учебные материалы по дисциплине "Физика"</li>
          <li>Внедрить интерактивные методы обучения по всем дисциплинам</li>
        </ul>
      </div>
      
      <style jsx>{`
        .filters {
          display: flex;
          gap: 20px;
        }
        
        .problem-disciplines {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .discipline {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .discipline-name {
          flex: 1;
          font-weight: 500;
        }
        
        .discipline-score {
          width: 80px;
          text-align: center;
          font-weight: 700;
          font-size: 18px;
        }
        
        .discipline-status {
          width: 150px;
          text-align: center;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 14px;
        }
        
        .discipline-status.low {
          background: #fadbd8;
          color: #c0392b;
        }
        
        .discipline-status.medium {
          background: #fdebd0;
          color: #e67e22;
        }
        
        .recommendations {
          padding-left: 25px;
        }
        
        .recommendations li {
          margin-bottom: 10px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default DataAnalysisPage;