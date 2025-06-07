import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfile = () => {
    // Add profile logic here
    console.log('Profile clicked');
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    // Add settings logic here
    console.log('Settings clicked');
    setIsDropdownOpen(false);
  };

  return (
    <div className="user-profile" ref={dropdownRef}>
      <button 
        className="profile-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="profile-avatar">
          <span className="avatar-text">
            {user?.first_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isDropdownOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-name">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || 'User'}
              </div>
              <div className="user-email">{user?.email || 'user@smartsales.com'}</div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleProfile}>
              <span className="item-icon">◐</span>
              <span className="item-text">Profile</span>
            </button>
            
            <button className="dropdown-item" onClick={handleSettings}>
              <span className="item-icon">◎</span>
              <span className="item-text">Settings</span>
            </button>
            
            <div className="dropdown-divider"></div>
            
            <button className="dropdown-item logout" onClick={handleLogout}>
              <span className="item-icon">◗</span>
              <span className="item-text">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
