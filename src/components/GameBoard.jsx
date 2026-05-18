import React, { useEffect, useRef } from 'react';
import BoardCell from './BoardCell';
import { ArrowRightLeft, Sparkles } from 'lucide-react';

const GameBoard = ({ board, players, currentPlayerId, onSelectPath }) => {
  const activePlayerRef = useRef(null);
  const containerRef = useRef(null);

  const activePlayer = players.find(p => p.id === currentPlayerId);
  const activePosition = activePlayer ? activePlayer.position : 0;

  useEffect(() => {
    if (activePlayerRef.current && containerRef.current) {
      activePlayerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activePosition, currentPlayerId]);

  if (!board.length) return null;

  const renderCells = () => {
    const elements = [];
    let i = 0;
    
    while (i <= 60) {
      const isBifurcation1 = i === 16;
      const isBifurcation2 = i === 31;

      if (isBifurcation1 || isBifurcation2) {
        const length = 5; // Bifurcation size (e.g. 16, 17, 18, 19, 20)
        const startCheckpoint = i - 1; // 15 or 30
        const isAtDecisionPoint = activePlayer && activePlayer.position === startCheckpoint;

        const leftCells = [];
        const rightCells = [];

        for (let j = 0; j < length; j++) {
          const currentId = i + j;
          const cell = board[currentId] || { id: currentId, type: 'QUIZ_FISICO' };

          // Players on path A
          const playersA = players.filter(p => p.position === currentId && (p.pathBranch === 'A' || !p.pathBranch));
          // Players on path B
          const playersB = players.filter(p => p.position === currentId && p.pathBranch === 'B');
          
          leftCells.push(
            <BoardCell 
              key={`${currentId}A`} 
              cell={{...cell, id: `${currentId}A`}} 
              playersHere={playersA} 
              currentPlayerId={currentPlayerId} 
            />
          );

          // Give branch B different types so players see different question icons
          let typeB = 'QUIZ_MENTAL';
          if (cell.type === 'QUIZ_MENTAL') typeB = 'QUIZ_ESPIRITUAL';
          if (cell.type === 'QUIZ_ESPIRITUAL') typeB = 'BONUS';
          if (cell.type === 'PENALTY') typeB = 'QUIZ_FISICO';

          rightCells.push(
            <BoardCell 
              key={`${currentId}B`} 
              cell={{...cell, id: `${currentId}B`, type: typeB}} 
              playersHere={playersB} 
              currentPlayerId={currentPlayerId} 
            />
          );
        }

        elements.push(
          <div key={`bifurcation-${i}`} className="col-span-3 bg-slate-900/5 rounded-2xl p-2 border-2 border-slate-300 shadow-inner flex flex-col gap-2 relative my-2">
            
            {/* Decison Modal Overlay covering the bifurcation block when player is at the start checkpoint */}
            {isAtDecisionPoint && (
              <div className="absolute -inset-2 bg-slate-900/80 backdrop-blur-md z-30 rounded-2xl flex items-center justify-center flex-col p-4 border border-violet-500 shadow-2xl animate-fade-in">
                <ArrowRightLeft className="text-violet-400 mb-2 animate-bounce" size={28} />
                <h3 className="text-sm font-black text-white uppercase text-center mb-3 tracking-widest">
                  Escolha sua Trilha
                </h3>
                <div className="flex gap-3 w-full max-w-[200px]">
                  <button 
                    onClick={() => onSelectPath && onSelectPath(currentPlayerId, 'A')} 
                    className={`flex-1 py-3 px-1 rounded-xl font-bold text-[9px] uppercase border transition-transform active:scale-95 flex flex-col items-center gap-1 ${activePlayer.pathBranch === 'A' || !activePlayer.pathBranch ? 'bg-amber-500 border-amber-300 text-slate-900 shadow-lg scale-105' : 'bg-slate-800 text-amber-500 border-amber-600/50'}`}
                  >
                    <span className="text-lg">🌿</span>
                    Esquerda
                  </button>
                  <button 
                    onClick={() => onSelectPath && onSelectPath(currentPlayerId, 'B')} 
                    className={`flex-1 py-3 px-1 rounded-xl font-bold text-[9px] uppercase border transition-transform active:scale-95 flex flex-col items-center gap-1 ${activePlayer.pathBranch === 'B' ? 'bg-cyan-500 border-cyan-300 text-slate-900 shadow-lg scale-105' : 'bg-slate-800 text-cyan-500 border-cyan-600/50'}`}
                  >
                    <span className="text-lg">🧭</span>
                    Direita
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center px-4 mb-1">
              <span className="text-[10px] font-black text-amber-700 uppercase flex items-center gap-1"><Sparkles size={12}/> Trilha A</span>
              <span className="text-[10px] font-black text-cyan-700 uppercase flex items-center gap-1">Trilha B <Sparkles size={12}/></span>
            </div>
            
            <div className="flex gap-3 w-full">
              <div className="flex-1 grid grid-cols-1 gap-3 border-r-2 border-slate-300/50 pr-3">
                {leftCells}
              </div>
              <div className="flex-1 grid grid-cols-1 gap-3 pl-0">
                {rightCells}
              </div>
            </div>
          </div>
        );

        i += length; // Skip standard rendering for these cells
      } else {
        const cell = board[i];
        if (!cell) { i++; continue; }
        
        const playersHere = players.filter(p => p.position === cell.id);
        const isCurrentPlayerHere = cell.id === activePosition;

        elements.push(
          <div key={cell.id} ref={isCurrentPlayerHere ? activePlayerRef : null}>
            <BoardCell 
              cell={cell} 
              playersHere={playersHere} 
              currentPlayerId={currentPlayerId} 
            />
          </div>
        );
        i++;
      }
    }

    return elements;
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-desbrava-sand p-4 pb-24 relative scrollbar-none"
    >
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto pb-10">
        {renderCells()}
      </div>
    </div>
  );
};

export default GameBoard;
