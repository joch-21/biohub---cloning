import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-page-content">
      
      {/* 仪表盘卡片网格 */}
      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card-small"></div>
        <div className="dashboard-card dashboard-card-small"></div>
        <div className="dashboard-card dashboard-card-small"></div>
        <div className="dashboard-card dashboard-card-small"></div>
        
        <div className="dashboard-card dashboard-card-large"></div>
        <div className="dashboard-card dashboard-card-large"></div>
      </div>
    </div>
  );
}