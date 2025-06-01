import React, { useState } from 'react';

const DataUploadPage = ({ user }) => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Имитация загрузки
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFile(null);
    }, 2000);
  };

  return (
    <div>
      <h1 className="page-title">Загрузка данных</h1>
      
      <div className="card">
        <h3 className="card-title">Загрузить данные для анализа</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Формат данных</label>
            <select 
              className="form-control"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="excel">Excel (XLSX)</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Выберите файл</label>
            <input 
              type="file" 
              className="form-control" 
              onChange={handleFileChange}
              accept={
                format === 'excel' ? '.xlsx,.xls' : 
                format === 'csv' ? '.csv' : 
                format === 'json' ? '.json' : '.xml'
              }
            />
          </div>
          
          {file && (
            <div className="file-info">
              <p><strong>Имя файла:</strong> {file.name}</p>
              <p><strong>Размер:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Загрузить данные'}
            </button>
          </div>
        </form>
        
        {success && (
          <div className="success-message">
            Файл успешно загружен! Данные будут обработаны в ближайшее время.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="card">
        <h3 className="card-title">История загрузок</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Файл</th>
              <th>Формат</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-12-10</td>
              <td>academic_performance.xlsx</td>
              <td>Excel</td>
              <td>Обработан</td>
            </tr>
            <tr>
              <td>2023-12-05</td>
              <td>student_feedback.csv</td>
              <td>CSV</td>
              <td>Обработан</td>
            </tr>
            <tr>
              <td>2023-11-28</td>
              <td>attendance_data.json</td>
              <td>JSON</td>
              <td>Обработан</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .file-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
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
      `}</style>
    </div>
  );
};

export default DataUploadPage;