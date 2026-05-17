import React from 'react';
import { Dices } from 'lucide-react';

const Dice = ({ onRoll, isRolling, disabled, lastRoll, activePlayer }) => {
  // Render CSS dots for the dice face
  const renderDiceFace = (num) => {
    const dotPositions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [25, 75], [75, 25], [75, 75]],
      5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
    };

    const dots = dotPositions[num] || [];

    return (
      <div className="relative w-14 h-14 bg-white border-2 border-desbrava-blue rounded-xl shadow-inner flex items-center justify-center">
        {dots.map(([cx, cy], idx) => (
          <div
            key={idx}
            className="absolute w-2.5 h-2.5 bg-desbrava-blue rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cx}%`, top: `${cy}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      {/* Active Player Turn Banner */}
      {activePlayer && (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider">
          <span className={`w-3.5 h-3.5 rounded-full border border-white ${activePlayer.color}`} />
          <span>Turno de: <strong className="text-desbrava-yellow">{activePlayer.name}</strong></span>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 w-full">
        {/* Dice Visual representation */}
        <div className={`transition-all duration-300 ${isRolling ? 'animate-spin-dice scale-110' : ''}`}>
          {lastRoll ? renderDiceFace(lastRoll) : (
            <div className="w-14 h-14 bg-white/10 border-2 border-white/20 text-desbrava-yellow rounded-xl flex items-center justify-center">
              <Dices size={28} />
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onRoll}
          disabled={disabled || isRolling}
          className={`flex-1 py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 font-black text-sm md:text-base uppercase tracking-widest shadow-xl transition-all border-b-4
            ${disabled 
              ? 'bg-gray-500 text-gray-300 border-gray-700 cursor-not-allowed opacity-80' 
              : 'bg-desbrava-yellow text-desbrava-blue hover:bg-yellow-400 border-yellow-600 active:scale-95'}
          `}
        >
          <Dices size={18} />
          <span>{isRolling ? 'Rolando...' : 'Rolar Dado'}</span>
        </button>

        {/* Rolled number badge */}
        {lastRoll && !isRolling && (
          <div className="bg-desbrava-yellow text-desbrava-blue font-black px-4 py-3 rounded-xl border border-yellow-600 shadow-md text-xl animate-bounce">
            +{lastRoll}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dice;
