import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface PlaceholderProps {
  title: string;
  icon: React.ReactNode;
  onBack: () => void;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, icon, onBack }) => {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-white">
      <button className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100" onClick={onBack}>
        <FaArrowLeft className="w-5 h-5" />
      </button>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="text-blue-500 mb-4">{icon}</div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500">This feature is coming soon!</p>
      </div>
    </div>
  );
};

export default Placeholder; 