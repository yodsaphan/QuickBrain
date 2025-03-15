import React from 'react';

const Header = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center items-center p-4 border-b-0 bg-transparent z-10 absolute w-full top-2.5">
      <div className="flex gap-5 bg-black/20 rounded-[20px] p-2 px-4 backdrop-blur-sm">
        <div 
          className={`font-bold text-base px-1.5 cursor-pointer ${activeTab === 'forYou' ? 'text-white relative after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-white' : 'text-white/70'}`}
          onClick={() => onTabChange('forYou')}
        >
          For You
        </div>
        <div 
          className={`font-bold text-base px-1.5 cursor-pointer ${activeTab === 'following' ? 'text-white relative after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-white' : 'text-white/70'}`}
          onClick={() => onTabChange('following')}
        >
          Following
        </div>
      </div>
    </div>
  );
};

export default Header; 