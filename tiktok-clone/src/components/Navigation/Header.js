import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Header = ({ activeTab, onTabChange }) => {
  return (
    <div className="header">
      <div className="header-tabs">
        <div 
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => onTabChange('following')}
        >
          Following
        </div>
        <div 
          className={`tab ${activeTab === 'forYou' ? 'active' : ''}`}
          onClick={() => onTabChange('forYou')}
        >
          For You
        </div>
      </div>
      <div className="search-icon">
        <FaSearch />
      </div>
    </div>
  );
};

export default Header; 