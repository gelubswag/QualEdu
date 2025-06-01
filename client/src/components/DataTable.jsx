import React from 'react';

const DataTable = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div className="card">Нет данных для отображения</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        
        .data-table th,
        .data-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .data-table th {
          background-color: #f5f7fa;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .data-table tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default DataTable;