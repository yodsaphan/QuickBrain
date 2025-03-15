import React from 'react';
import { FaHome, FaSearch, FaGamepad, FaFire, FaUser } from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';

const BottomNav = ({ activeView, onNavigate }) => {
  return (
    <div className="bottom-nav">
      <div 
        className={`nav-item ${activeView === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <FaHome />
        <span>Home</span>
      </div>
      <div 
        className={`nav-item ${activeView === 'discover' ? 'active' : ''}`}
        onClick={() => onNavigate('discover')}
      >
        <FaSearch />
        <span>Discover</span>
      </div>
      <div 
        className={`nav-item ${activeView === 'flashcards' ? 'active' : ''}`}
        onClick={() => onNavigate('flashcards')}
      >
        <FaGamepad />
        <span>Games</span>
      </div>
      <div 
        className={`nav-item ${activeView === 'streaks' ? 'active' : ''}`}
        onClick={() => onNavigate('streaks')}
      >
        <BsLightningChargeFill />
        <span>Streaks</span>
      </div>
      <div 
        className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
        onClick={() => onNavigate('profile')}
      >
        <FaUser />
        <span>Me</span>
      </div>
    </div>
  );
};

export default BottomNav; 