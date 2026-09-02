import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isGameMode, toggleMode }) => {
  return (
    <div className="toggle-container">
      <span className={`toggle-label ${!isGameMode ? 'active' : ''}`}>Normal</span>
      <button 
        className={`toggle-switch ${isGameMode ? 'game-mode' : ''}`}
        onClick={toggleMode}
        aria-label="Toggle between Normal and Game mode"
      >
        <span className="toggle-thumb" />
      </button>
      <span className={`toggle-label ${isGameMode ? 'active' : ''}`}>Game</span>
    </div>
  );
};

export default ToggleSwitch;
