import React from 'react';
import { User } from '@/types';

interface HeaderProps {
  activeTab: 'forYou' | 'following';
  onTabChange: (tab: 'forYou' | 'following') => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, user }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex space-x-8">
        <button 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeTab === 'forYou'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          onClick={() => onTabChange('forYou')}
        >
          For You
        </button>
        <button 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeTab === 'following'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          onClick={() => onTabChange('following')}
        >
          Following
        </button>
      </div>
    </div>
      </div>
    </nav>
  );
};

export default Header; 