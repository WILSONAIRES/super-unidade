import React from 'react';
import { Star, MapPin, Trophy } from 'lucide-react';

const GameHeader = ({ players, currentPlayerId }) => {
  const activePlayer = players.find(p => p.id === currentPlayerId) || players[0];

  return (
    <header className="bg-desbrava-blue text-white p-3 shadow-md z-10 shrink-0 border-b-4 border-desbrava-yellow flex flex-col gap-2">
      {/* Active Player Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow ${activePlayer.color}`}>
            {activePlayer.name.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm leading-none flex items-center gap-1">
              {activePlayer.name}
              <span className="text-[9px] bg-desbrava-yellow text-desbrava-blue px-1 py-0.5 rounded font-black uppercase">
                Turno
              </span>
            </span>
            <span className="text-desbrava-sand text-[10px] font-semibold">{activePlayer.club}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-desbrava-green px-2.5 py-0.5 rounded-full border border-desbrava-lightGreen flex items-center gap-1 shadow-inner text-xs">
            <MapPin size={11} className="text-desbrava-sand" />
            <span className="font-extrabold">Casa {activePlayer.position}/60</span>
          </div>

          <div className="bg-desbrava-yellow text-desbrava-blue px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow font-black text-xs">
            <Star size={11} className="fill-desbrava-blue" />
            <span>{activePlayer.score} PUP</span>
          </div>
        </div>
      </div>

      {/* Mini Standings for all players */}
      {players.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1 border-t border-white/10 mt-1 scrollbar-none items-center">
          <span className="text-[9px] font-black text-desbrava-yellow uppercase tracking-wider shrink-0 flex items-center gap-0.5">
            <Trophy size={10} /> Placar:
          </span>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {players.map((p) => {
              const isActive = p.id === currentPlayerId;
              return (
                <div 
                  key={p.id} 
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                    isActive 
                      ? 'bg-white text-desbrava-blue border-desbrava-yellow scale-105 shadow' 
                      : 'bg-white/5 text-white/80 border-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.color}`} />
                  <span className="truncate max-w-[60px]">{p.name}</span>
                  <span className="font-black text-desbrava-yellow">C{p.position}</span>
                  <span className="opacity-65">({p.score}P)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default GameHeader;
