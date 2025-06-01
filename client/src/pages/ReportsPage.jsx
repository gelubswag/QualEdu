import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getReportsData } from '../database';

const ReportsPage = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [reportType, setReportType] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await getReportsData();
        setReports(reportsData);
      } catch (error) {
        console.error('Ошибка загрузки отчетов:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const handleGenerateReport = () => {
    alert(`Отчет будет сгенерирован в формате ${selectedFormat.toUpperCase()}`);
  };

  const filteredReports = reportType === 'all' 
    ? reports 
    : reports.filter(report => report.status === reportType);

  if (loading) {
    return <div className="container">Загрузка отчетов...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Отчеты</h1>
      
      <div className="card">
        <h3 className="card-title">Сформировать отчет</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Тип отчета</label>
            <select 
              className="form-control"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="all">Все программы</option>
              <option value="Высокий">Программы высокого качества</option>
              <option value="Средний">Программы среднего качества</option>
              <option value="Низкий">Программы низкого качества</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Формат</label>
            <select 
              className="form-control"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="word">Word</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <button 
              className="btn btn-primary"
              onClick={handleGenerateReport}
              style={{ width: '100%' }}
            >
              Сформировать отчет
            </button>
          </div>
        </div>
      </div>
      
      <DataTable 
        data={filteredReports.map(report => ({
          'Программа': report.program,
          'Дисциплина': report.discipline,
          'Оценка качества': `${report.qualityScore}%`,
          'Статус': report.status,
          'Дата': report.date
        }))} 
        title="Отчеты по качеству образовательных программ" 
      />
      
      <style jsx>{`
        .form-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;