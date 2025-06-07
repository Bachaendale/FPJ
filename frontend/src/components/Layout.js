import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Products from './Products';
import './Layout.css';

const Layout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'products':
        return <Products />;
      case 'inventory':
        return (
          <div className="content-placeholder">
            <div className="placeholder-icon">📋</div>
            <h2>Inventory Management</h2>
            <p>Inventory tracking features coming soon...</p>
          </div>
        );
      case 'sales':
        return (
          <div className="content-placeholder">
            <div className="placeholder-icon">💰</div>
            <h2>Sales Management</h2>
            <p>Sales tracking features coming soon...</p>
          </div>
        );
      case 'forecasts':
        return (
          <div className="content-placeholder">
            <div className="placeholder-icon">📈</div>
            <h2>Sales Forecasting</h2>
            <p>AI-powered forecasting features coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="content-placeholder">
            <div className="placeholder-icon">📄</div>
            <h2>Reports & Analytics</h2>
            <p>Advanced reporting features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="content-placeholder">
            <div className="placeholder-icon">⚙️</div>
            <h2>Settings</h2>
            <p>Application settings coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">
        <Header activeSection={activeSection} />
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Layout;
