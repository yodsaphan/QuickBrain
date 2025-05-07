import React from 'react';
import { FaHome, FaBook, FaUser, FaSearch } from 'react-icons/fa';

interface BottomNavProps {
  activeView: 'home' | 'learn' | 'profile' | 'search' | 'login';
  onNavigate: (view: 'home' | 'learn' | 'profile' | 'search' | 'login') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around items-center h-16">
      <button 
            className={`inline-flex flex-col items-center justify-center gap-1 px-3 py-2 text-sm font-medium ${
              activeView === 'home' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        onClick={() => onNavigate('home')}
      >
            <FaHome className="w-5 h-5" />
        <span>Home</span>
      </button>
      <button 
            className={`inline-flex flex-col items-center justify-center gap-1 px-3 py-2 text-sm font-medium ${
              activeView === 'learn' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        onClick={() => onNavigate('learn')}
      >
            <FaBook className="w-5 h-5" />
        <span>Learn</span>
      </button>
      <button 
            className={`inline-flex flex-col items-center justify-center gap-1 px-3 py-2 text-sm font-medium ${
              activeView === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        onClick={() => onNavigate('profile')}
      >
            <FaUser className="w-5 h-5" />
        <span>Profile</span>
      </button>
      <button 
            className={`inline-flex flex-col items-center justify-center gap-1 px-3 py-2 text-sm font-medium ${
              activeView === 'search' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        onClick={() => onNavigate('search')}
      >
            <FaSearch className="w-5 h-5" />
        <span>Search</span>
      </button>
    </div>
      </div>
    </nav>
  );
};

export default BottomNav; 