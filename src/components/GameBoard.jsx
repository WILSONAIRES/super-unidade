import React, { useEffect, useRef } from 'react';
import BoardCell from './BoardCell';

const GameBoard = ({ board, players, currentPlayerId }) => {
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

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-desbrava-sand p-4 pb-24 relative"
    >
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto">
        {board.map((cell) => {
          const playersHere = players.filter(p => p.position === cell.id);
          const isCurrentPlayerHere = cell.id === activePosition;
          
          return (
            <div key={cell.id} ref={isCurrentPlayerHere ? activePlayerRef : null}>
              <BoardCell 
                cell={cell} 
                playersHere={playersHere} 
                currentPlayerId={currentPlayerId} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
