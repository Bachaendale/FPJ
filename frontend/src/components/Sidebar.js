import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '▦' },
    { id: 'customers', name: 'Customers', icon: '◉' },
    { id: 'products', name: 'Products', icon: '▣' },
    { id: 'inventory', name: 'Inventory', icon: '▤' },
    { id: 'sales', name: 'Sales', icon: '◈' },
    { id: 'forecasts', name: 'Forecasts', icon: '▲' },
    { id: 'reports', name: 'Reports', icon: '▥' },
    { id: 'settings', name: 'Settings', icon: '◎' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <span className="logo-icon">◆</span>
          Smart Sales
        </h2>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">◐</div>
          <div className="user-details">
            <div className="user-name">Admin User</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
