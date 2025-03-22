import React from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';

interface StreakDisplayProps {
  count: number;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <div className="streak-display">
      <BsLightningChargeFill className="streak-icon" />
      <span className="streak-count">{count}</span>
      <span className="streak-label">day streak</span>
    </div>
  );
};

export default StreakDisplay; 