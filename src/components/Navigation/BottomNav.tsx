import React from 'react';
import { FaHome, FaBook, FaUser, FaSearch } from 'react-icons/fa';

interface BottomNavProps {
  activeView: 'home' | 'learn' | 'profile' | 'search' | 'login';
  onNavigate: (view: 'home' | 'learn' | 'profile' | 'search' | 'login') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="bottom-nav">
      <button 
        className={`nav-item ${activeView === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <FaHome />
        <span>Home</span>
      </button>
      <button 
        className={`nav-item ${activeView === 'learn' ? 'active' : ''}`}
        onClick={() => onNavigate('learn')}
      >
        <FaBook />
        <span>Learn</span>
      </button>
      <button 
        className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
        onClick={() => onNavigate('profile')}
      >
        <FaUser />
        <span>Profile</span>
      </button>
      <button 
        className={`nav-item ${activeView === 'search' ? 'active' : ''}`}
        onClick={() => onNavigate('search')}
      >
        <FaSearch />
        <span>Search</span>
      </button>
    </div>
  );
};

export default BottomNav; 