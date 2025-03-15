import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const Placeholder = ({ title, icon, onBack }) => {
  return (
    <div className="placeholder-container">
      <div className="placeholder-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>{title}</h2>
      </div>
      <div className="placeholder-content">
        <div className="placeholder-icon">
          {icon}
        </div>
        <h3>Coming Soon</h3>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

export default Placeholder; 