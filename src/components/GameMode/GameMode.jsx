import React, { useEffect, useRef, useState } from 'react';
import { initGame, mobileInput } from './gameLogic';
import './GameMode.css';

const GameMode = () => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch capability
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      gameRef.current = initGame(containerRef.current);
    }
    return () => {
      if (gameRef.current && typeof gameRef.current.quit === 'function') {
        try { gameRef.current.quit(); } catch (_) {}
      }
      gameRef.current = null;
      // Reset mobile input on unmount
      mobileInput.left = false;
      mobileInput.right = false;
      mobileInput.jump = false;
      mobileInput.interact = false;
    };
  }, []);

  // Touch event handlers (using onPointerDown/Up for better compat)
  const handleTouch = (key, value) => (e) => {
    e.preventDefault();
    mobileInput[key] = value;
  };

  return (
    <div className="gm-root">
      <div ref={containerRef} className="gm-canvas-container" />

      {/* Mobile controls - visible on touch devices */}
      {isTouchDevice && (
        <div className="gm-mobile-controls">
          {/* Left side: D-pad */}
          <div className="gm-dpad">
            <button
              className="gm-dpad-btn gm-dpad-left"
              onTouchStart={handleTouch('left', true)}
              onTouchEnd={handleTouch('left', false)}
              onTouchCancel={handleTouch('left', false)}
              aria-label="Move left"
            >
              ◀
            </button>
            <button
              className="gm-dpad-btn gm-dpad-right"
              onTouchStart={handleTouch('right', true)}
              onTouchEnd={handleTouch('right', false)}
              onTouchCancel={handleTouch('right', false)}
              aria-label="Move right"
            >
              ▶
            </button>
          </div>

          {/* Right side: Action buttons */}
          <div className="gm-action-btns">
            <button
              className="gm-action-btn gm-jump-btn"
              onTouchStart={handleTouch('jump', true)}
              onTouchEnd={handleTouch('jump', false)}
              onTouchCancel={handleTouch('jump', false)}
              aria-label="Jump"
            >
              ▲
            </button>
            <button
              className="gm-action-btn gm-interact-btn"
              onTouchStart={handleTouch('interact', true)}
              onTouchEnd={handleTouch('interact', false)}
              onTouchCancel={handleTouch('interact', false)}
              aria-label="Interact"
            >
              E
            </button>
          </div>
        </div>
      )}

      <div className="gm-hint">
        <span>
          {isTouchDevice
            ? 'Use the on-screen controls · Walk into glowing zones'
            : 'WASD / Arrow Keys to move · Space to jump · E to interact'}
        </span>
      </div>
    </div>
  );
};

export default GameMode;
