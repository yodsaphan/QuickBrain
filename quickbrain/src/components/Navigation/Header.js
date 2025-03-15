import React from 'react';

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
    </div>
  );
};

export default Header; 