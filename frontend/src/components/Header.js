import React from 'react';
import UserProfile from './UserProfile';
import './Header.css';

const Header = ({ activeSection }) => {
  const getSectionTitle = (section) => {
    const titles = {
      dashboard: 'Dashboard',
      customers: 'Customers',
      products: 'Products',
      inventory: 'Inventory',
      sales: 'Sales',
      forecasts: 'Forecasts',
      reports: 'Reports',
      settings: 'Settings'
    };
    return titles[section] || 'Dashboard';
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{getSectionTitle(activeSection)}</h1>
        </div>
        
        <div className="header-right">
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
