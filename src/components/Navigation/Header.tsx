import React from 'react';
import { User } from '@/types';

interface HeaderProps {
  activeTab: 'forYou' | 'following';
  onTabChange: (tab: 'forYou' | 'following') => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, user }) => {
  return (
    <div className="header">
      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'forYou' ? 'active' : ''}`}
          onClick={() => onTabChange('forYou')}
        >
          For You
        </button>
        <button 
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => onTabChange('following')}
        >
          Following
        </button>
      </div>
    </div>
  );
};

export default Header; 