import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface PlaceholderProps {
  title: string;
  icon: React.ReactNode;
  onBack: () => void;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, icon, onBack }) => {
  return (
    <div className="placeholder-container">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft />
      </button>
      <div className="placeholder-content">
        <div className="icon-container">{icon}</div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500">This feature is coming soon!</p>
      </div>
    </div>
  );
};

export default Placeholder; 