import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import { getAnalysisData } from '../database';

const DashboardPage = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 6) greeting = 'Доброй ночи';
    else if (hour < 12) greeting = 'Доброе утро';
    else if (hour < 18) greeting = 'Добрый день';
    else greeting = 'Добрый вечер';
    
    return `${greeting}, ${user.name}!`;
  };

  if (loading) {
    return <div className="container">Загрузка данных...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">{getWelcomeMessage()}</h1>
      
      <div className="grid">
        <div className="card" style={{minWidth: '400px'}} >
          <h3 className="card-title" >Ключевые показатели</h3>
          <div className="indicators">
            <div className="indicator" style={{maxWidth: '90px'}}>
              <div className="indicator-value">92%</div>
              <div className="indicator-label">Общая успеваемость</div>
            </div>
            <div className="indicator">
              <div className="indicator-value">88%</div>
              <div className="indicator-label">Удовлетворенность</div>
            </div>
            <div className="indicator">
              <div className="indicator-value">95%</div>
              <div className="indicator-label">Посещаемость</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Статус программы</h3>
          <div className="program-status">
            <div className="status-high">Высокое качество</div>
            <p>Общая оценка качества программы: <strong>89%</strong></p>
            <p>Минимальный порог качества: <strong>70%</strong></p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '89%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {data && (
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
      )}
      
      <style jsx>{`
        .indicators {
          display: flex;
          justify-content: space-around;
          text-align: center;
        }
        
        .indicator {
          padding: 15px;
        }
        
        .indicator-value {
          font-size: 32px;
          font-weight: 700;
          color: #3498db;
        }
        
        .indicator-label {
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .program-status {
          text-align: center;
        }
        
        .status-high {
          background: #27ae60;
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .progress-bar {
          height: 10px;
          background: #ecf0f1;
          border-radius: 5px;
          margin-top: 15px;
          overflow: hidden;
        }
        
        .progress {
          height: 100%;
          background: #3498db;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;