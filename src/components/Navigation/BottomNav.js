import React from 'react';
import { FaHome, FaSearch, FaGamepad, FaUser, FaBolt } from 'react-icons/fa';

const BottomNav = ({ activeView, onNavigate }) => {
  return (
    <div className="flex justify-around items-center py-3 px-2 bg-black/90 backdrop-blur-md fixed bottom-0 w-full z-10 border-t border-gray-800">
      <button 
        className={`flex flex-col items-center justify-center ${activeView === 'home' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => onNavigate('home')}
      >
        <FaHome className="text-xl mb-1" />
        <span className="text-xs">Home</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center ${activeView === 'discover' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => onNavigate('discover')}
      >
        <FaSearch className="text-xl mb-1" />
        <span className="text-xs">Discover</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center ${activeView === 'flashcards' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => onNavigate('flashcards')}
      >
        <FaGamepad className="text-xl mb-1" />
        <span className="text-xs">Games</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center ${activeView === 'streaks' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => onNavigate('streaks')}
      >
        <FaBolt className="text-xl mb-1" />
        <span className="text-xs">Streaks</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center ${activeView === 'profile' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => onNavigate('profile')}
      >
        <FaUser className="text-xl mb-1" />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav; 