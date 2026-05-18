import React from 'react';
import { HelpCircle, AlertTriangle, Tent, Flag, CheckCircle, Dumbbell, Brain, Heart, Sparkles, Trophy } from 'lucide-react';

const BoardCell = ({ cell, playersHere, currentPlayerId }) => {
  let bgColor = 'bg-slate-300';
  let icon = null;
  let label = cell.id;
  let cellName = '';

  const checkpoints = [15, 30, 45, 60];
  const isCheckpoint = checkpoints.includes(cell.id);

  if (isCheckpoint) {
    if (cell.id === 60) {
      bgColor = 'bg-gradient-to-br from-yellow-500 via-amber-500 to-red-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] border-4 border-yellow-300 animate-pulse';
      icon = <Trophy className="text-yellow-150 fill-yellow-200 animate-bounce" size={22} />;
      cellName = 'Portal Final';
    } else {
      bgColor = 'bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-violet-700 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border-2 border-yellow-400 animate-pulse';
      icon = <Sparkles className="text-yellow-300 fill-yellow-300 animate-bounce" size={20} />;
      cellName = 'Portal';
    }
  } else {
    switch (cell.type) {
      case 'START':
        bgColor = 'bg-desbrava-yellow text-desbrava-blue';
        icon = <Flag size={20} />;
        label = 'Largada';
        break;
      case 'FINISH':
        bgColor = 'bg-desbrava-yellow text-desbrava-blue';
        icon = <CheckCircle size={20} />;
        label = 'Chegada';
        break;
      case 'QUIZ_FISICO':
        bgColor = 'bg-amber-600 text-white';
        icon = <Dumbbell size={18} />;
        cellName = 'Físico';
        break;
      case 'QUIZ_MENTAL':
        bgColor = 'bg-blue-600 text-white';
        icon = <Brain size={18} />;
        cellName = 'Mental';
        break;
      case 'QUIZ_ESPIRITUAL':
        bgColor = 'bg-purple-600 text-white';
        icon = <Heart size={18} />;
        cellName = 'Espiritual';
        break;
      case 'PENALTY':
        bgColor = 'bg-red-600 text-white';
        icon = <AlertTriangle size={18} />;
        cellName = 'Inspeção';
        break;
      case 'BONUS':
        bgColor = 'bg-desbrava-green text-white';
        icon = <Tent size={18} />;
        cellName = 'Rotina';
        break;
      default:
        break;
    }
  }

  const isCurrentPlayerHere = playersHere.some(p => p.id === currentPlayerId);

  return (
    <div className={`relative flex flex-col items-center justify-between h-24 p-2 rounded-xl border-b-4 border-black/20 shadow-md transition-all duration-300 ${bgColor} ${isCurrentPlayerHere ? 'ring-4 ring-desbrava-yellow scale-105 z-10 shadow-lg' : ''}`}>
      
      {/* House Number or Special Labels */}
      <div className="flex justify-between w-full items-center">
        <span className="text-xs font-black bg-black/20 px-1.5 py-0.5 rounded text-white">
          {cell.id}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
          {cellName}
        </span>
      </div>

      {/* Main Icon */}
      <div className="flex-1 flex items-center justify-center my-1 opacity-90">
        {icon}
      </div>

      {/* Render Players on this House */}
      <div className="flex flex-wrap gap-1 justify-center w-full min-h-[16px]">
        {playersHere.map((player) => {
          const isActive = player.id === currentPlayerId;
          return (
            <div
              key={player.id}
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black border border-white shadow-sm transition-transform duration-300 ${player.color} ${isActive ? 'scale-125 animate-pulse ring-2 ring-desbrava-yellow' : ''}`}
              title={`${player.name} (${player.club})`}
            >
              {player.name.substring(0, 1).toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Flag indicating it's the current player's spot */}
      {isCurrentPlayerHere && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-2 h-2 bg-desbrava-yellow rotate-45 border border-white" />
        </div>
      )}
      
    </div>
  );
};

export default BoardCell;
