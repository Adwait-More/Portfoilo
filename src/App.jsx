import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ToggleSwitch from './components/ToggleSwitch/ToggleSwitch';
import NormalMode from './components/NormalMode/NormalMode';
import GameMode from './components/GameMode/GameMode';

function App() {
  const [isGameMode, setIsGameMode] = useState(false);

  const toggleMode = () => setIsGameMode(prev => !prev);

  return (
    <>
      {/* Toggle always on top */}
      <ToggleSwitch isGameMode={isGameMode} toggleMode={toggleMode} />

      {/* Normal Mode */}
      <AnimatePresence mode="wait">
        {!isGameMode && (
          <motion.div
            key="normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NormalMode />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Mode — fixed, full-screen overlay */}
      <AnimatePresence>
        {isGameMode && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 500,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            <GameMode />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
