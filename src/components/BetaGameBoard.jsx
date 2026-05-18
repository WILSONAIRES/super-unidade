import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, Flag, HelpCircle, AlertTriangle, Tent, Dumbbell, Brain, Heart, ArrowRightLeft } from 'lucide-react';

const BetaGameBoard = ({ board, players, currentPlayerId, onSelectPath }) => {
  const containerRef = useRef(null);

  // Helper to generate X and Y coordinate percentages for a sinuous sine-wave path
  const getCoordinates = (cellId, branch = 'A') => {
    const startY = 80;
    const cellHeight = 100; // Spacing in px

    const y = startY + cellId * cellHeight;
    const swing = Math.sin(cellId * 0.45);
    let x = 50 + swing * 30; // base swing percent

    // Check if cell is in bifurcation zone 1 (16 to 25)
    if (cellId >= 16 && cellId <= 25) {
      if (branch === 'A') {
        x -= 16; // Shift left
      } else {
        x += 16; // Shift right
      }
    }
    // Check if cell is in bifurcation zone 2 (31 to 40)
    else if (cellId >= 31 && cellId <= 40) {
      if (branch === 'A') {
        x -= 16; // Shift left
      } else {
        x += 16; // Shift right
      }
    }

    return { x, y };
  };

  // Determine cell colors and icons based on type
  const getCellStyling = (cellId, type) => {
    const checkpoints = [15, 30, 45, 60];
    if (checkpoints.includes(cellId)) {
      if (cellId === 60) {
        return {
          bg: 'bg-gradient-to-br from-yellow-500 via-amber-500 to-red-600 border-4 border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-pulse',
          icon: <Trophy className="text-yellow-100 fill-yellow-250 animate-bounce" size={24} />,
          name: 'Portal Final'
        };
      }
      return {
        bg: 'bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-violet-700 border-2 border-yellow-400 shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-pulse',
        icon: <Sparkles className="text-yellow-300 fill-yellow-300 animate-bounce" size={20} />,
        name: 'Portal'
      };
    }

    switch (type) {
      case 'START':
        return { bg: 'bg-amber-500 border-4 border-white text-slate-900 font-black shadow-lg', icon: <Flag size={20} />, name: 'Largada' };
      case 'FINISH':
        return { bg: 'bg-yellow-500 border-4 border-white text-slate-900 font-black shadow-lg', icon: <Trophy size={20} />, name: 'Chegada' };
      case 'QUIZ_FISICO':
        return { bg: 'bg-amber-600 border border-amber-500 text-white shadow-md', icon: <Dumbbell size={16} />, name: 'Físico' };
      case 'QUIZ_MENTAL':
        return { bg: 'bg-blue-600 border border-blue-500 text-white shadow-md', icon: <Brain size={16} />, name: 'Mental' };
      case 'QUIZ_ESPIRITUAL':
        return { bg: 'bg-purple-600 border border-purple-500 text-white shadow-md', icon: <Heart size={16} />, name: 'Espiritual' };
      case 'PENALTY':
        return { bg: 'bg-red-600 border border-red-500 text-white shadow-md', icon: <AlertTriangle size={16} />, name: 'Inspeção' };
      case 'BONUS':
        return { bg: 'bg-emerald-600 border border-emerald-500 text-white shadow-md', icon: <Tent size={16} />, name: 'Rotina' };
      default:
        return { bg: 'bg-slate-500 text-white', icon: <HelpCircle size={16} />, name: '' };
    }
  };

  // Scroll viewport to active player when position changes
  const activePlayer = players.find(p => p.id === currentPlayerId);
  useEffect(() => {
    if (activePlayer && containerRef.current) {
      const activeCoords = getCoordinates(activePlayer.position, activePlayer.pathBranch || 'A');
      const container = containerRef.current;
      const targetScroll = activeCoords.y - container.clientHeight / 2;
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [activePlayer?.position, activePlayer?.pathBranch]);

  // Generate cells representing the board nodes
  const renderCells = () => {
    const elements = [];

    for (let i = 0; i <= 60; i++) {
      const cell = board[i] || { id: i, type: 'QUIZ_FISICO' };

      // Bifurcated zone handling
      const isInBifurcation1 = i >= 16 && i <= 25;
      const isInBifurcation2 = i >= 31 && i <= 40;

      if (isInBifurcation1 || isInBifurcation2) {
        // Draw Branch A (Left)
        const coordsA = getCoordinates(i, 'A');
        const stylingA = getCellStyling(i, cell.type);
        elements.push(
          <div
            key={`cell-${i}-A`}
            style={{ left: `${coordsA.x}%`, top: `${coordsA.y}px` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group select-none hover:scale-110 z-20 active:scale-95 ${stylingA.bg}`}
          >
            {stylingA.icon}
            <span className="text-[9px] font-black mt-0.5">{i}A</span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 bg-slate-950 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase whitespace-nowrap shadow-md z-30">
              Trilha Esquerda: {stylingA.name}
            </div>
          </div>
        );

        // Draw Branch B (Right)
        const coordsB = getCoordinates(i, 'B');
        // Let's vary the right cell type slightly for different experience!
        const altType = cell.type === 'QUIZ_FISICO' ? 'QUIZ_MENTAL' : cell.type === 'QUIZ_MENTAL' ? 'QUIZ_ESPIRITUAL' : 'BONUS';
        const stylingB = getCellStyling(i, altType);
        elements.push(
          <div
            key={`cell-${i}-B`}
            style={{ left: `${coordsB.x}%`, top: `${coordsB.y}px` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group select-none hover:scale-110 z-20 active:scale-95 ${stylingB.bg}`}
          >
            {stylingB.icon}
            <span className="text-[9px] font-black mt-0.5">{i}B</span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 bg-slate-950 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase whitespace-nowrap shadow-md z-30">
              Trilha Direita: {stylingB.name}
            </div>
          </div>
        );
      } else {
        // Standard non-bifurcated cell
        const coords = getCoordinates(i);
        const styling = getCellStyling(i, cell.type);

        elements.push(
          <div
            key={`cell-${i}`}
            style={{ left: `${coords.x}%`, top: `${coords.y}px` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group select-none hover:scale-110 z-20 active:scale-95 ${styling.bg}`}
          >
            {styling.icon}
            <span className="text-[9px] font-black mt-0.5">{i === 0 ? 'GO' : i === 60 ? 'FIM' : i}</span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 bg-slate-950 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase whitespace-nowrap shadow-md z-30">
              {styling.name}
            </div>
          </div>
        );
      }
    }
    return elements;
  };

  // Draw smooth connector SVG lines showing paths (including branching forks!)
  const renderPathSVG = () => {
    const paths = [];

    // Main single path sections and bifurcated paths
    let mainPathPoints = '';
    let branchAPoints = '';
    let branchBPoints = '';

    for (let i = 0; i <= 60; i++) {
      const coords = getCoordinates(i, 'A');
      const coordsR = getCoordinates(i, 'B');

      const isInBifurcation1 = i >= 16 && i <= 25;
      const isInBifurcation2 = i >= 31 && i <= 40;

      if (isInBifurcation1 || isInBifurcation2) {
        // Branch A (Left)
        if (branchAPoints === '') {
          // Connect fork start
          const startCoords = getCoordinates(i - 1);
          branchAPoints += `${startCoords.x}%,${startCoords.y} `;
        }
        branchAPoints += `${coords.x}%,${coords.y} `;

        // Branch B (Right)
        if (branchBPoints === '') {
          // Connect fork start
          const startCoords = getCoordinates(i - 1);
          branchBPoints += `${startCoords.x}%,${startCoords.y} `;
        }
        branchBPoints += `${coordsR.x}%,${coordsR.y} `;

        // If it's the end of bifurcation, connect back to main path point
        if (i === 25 || i === 40) {
          const mergeCoords = getCoordinates(i + 1);
          branchAPoints += `${mergeCoords.x}%,${mergeCoords.y}`;
          branchBPoints += `${mergeCoords.x}%,${mergeCoords.y}`;

          paths.push(
            <polyline
              key={`branch-a-${i}`}
              points={branchAPoints}
              className="stroke-amber-400/35 stroke-[8] fill-none stroke-dasharray-[10,8] animate-[dash_30s_linear_infinite]"
              style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
            />
          );
          paths.push(
            <polyline
              key={`branch-b-${i}`}
              points={branchBPoints}
              className="stroke-cyan-400/35 stroke-[8] fill-none stroke-dasharray-[10,8] animate-[dash_30s_linear_infinite]"
              style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
            />
          );

          branchAPoints = '';
          branchBPoints = '';
        }
      } else {
        // Standard path points
        mainPathPoints += `${coords.x}%,${coords.y} `;
        
        // If we hit the start of a bifurcation or final, draw the accumulated segment
        if (i === 15 || i === 30 || i === 60) {
          paths.push(
            <polyline
              key={`main-segment-${i}`}
              points={mainPathPoints.trim()}
              className="stroke-emerald-400/40 stroke-[8] fill-none stroke-dasharray-[10,8] animate-[dash_30s_linear_infinite]"
              style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
            />
          );
          mainPathPoints = `${coords.x}%,${coords.y} `; // Start next segment
        }
      }
    }

    return (
      <svg className="absolute top-0 left-0 w-full h-[6200px] pointer-events-none z-10">
        {paths}
      </svg>
    );
  };

  // Group players by position to calculate layout offsets (prevent pawn overlap)
  const getPawnOffsets = () => {
    const positionGroups = {};
    players.forEach((p) => {
      const key = `${p.position}-${p.pathBranch || 'A'}`;
      if (!positionGroups[key]) {
        positionGroups[key] = [];
      }
      positionGroups[key].push(p.id);
    });
    return positionGroups;
  };

  const positionGroups = getPawnOffsets();

  // Render animated player tokens/pawns hopping and walking
  const renderPawns = () => {
    return players.map((p) => {
      const coords = getCoordinates(p.position, p.pathBranch || 'A');
      const key = `${p.position}-${p.pathBranch || 'A'}`;
      const playersAtCell = positionGroups[key] || [];
      const indexInCell = playersAtCell.indexOf(p.id);
      
      // Calculate offset based on index to distribute pawns nicely
      let dx = 0;
      let dy = 0;
      if (playersAtCell.length > 1) {
        const angle = (indexInCell / playersAtCell.length) * 2 * Math.PI;
        const radius = 22; // Offset distance from center
        dx = Math.cos(angle) * radius;
        dy = Math.sin(angle) * radius;
      }

      const isCurrent = p.id === currentPlayerId;

      return (
        <div
          key={`pawn-${p.id}`}
          style={{
            left: `calc(${coords.x}% + ${dx}px)`,
            top: `${coords.y + dy}px`
          }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-black text-xs shadow-2xl transition-all duration-500 ease-out z-30 select-none ${p.color} ${
            isCurrent ? 'ring-4 ring-yellow-400 scale-125 animate-pulse z-40' : 'opacity-90'
          }`}
        >
          {p.name.substring(0, 2).toUpperCase()}
          {isCurrent && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-500 border border-white text-[8px] items-center justify-center font-black text-white">⭐</span>
            </span>
          )}
        </div>
      );
    });
  };

  // Show path selection control overlay if active player lands on a bifurcation house
  const renderPathSelector = () => {
    const isAtBifurcationStart = activePlayer && (activePlayer.position === 15 || activePlayer.position === 30);
    
    if (!isAtBifurcationStart) return null;

    return (
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 border border-violet-500 p-5 rounded-2xl shadow-2xl text-center w-[290px] backdrop-blur-md sticky">
        <ArrowRightLeft className="text-violet-400 mx-auto mb-3 animate-pulse" size={32} />
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">
          🔱 Bifurcação à Vista!
        </h3>
        <p className="text-[10px] font-bold text-violet-300/80 mb-4 leading-relaxed">
          Jogador <span className="text-yellow-400 font-extrabold">{activePlayer.name}</span>, selecione qual trilha da floresta deseja seguir:
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onSelectPath(activePlayer.id, 'A')}
            className={`py-2.5 px-4 rounded-xl font-black text-xs transition-all uppercase tracking-wide flex items-center justify-between border ${
              activePlayer.pathBranch === 'A'
                ? 'bg-amber-500 text-slate-900 border-amber-300 scale-102 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-amber-400 border-amber-600/40 hover:bg-slate-800'
            }`}
          >
            <span>🌿 Trilha Esquerda (Aventura)</span>
            {activePlayer.pathBranch === 'A' && <span className="text-[9px] bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded font-black">Ativo</span>}
          </button>

          <button
            onClick={() => onSelectPath(activePlayer.id, 'B')}
            className={`py-2.5 px-4 rounded-xl font-black text-xs transition-all uppercase tracking-wide flex items-center justify-between border ${
              activePlayer.pathBranch === 'B'
                ? 'bg-cyan-500 text-slate-900 border-cyan-300 scale-102 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-cyan-400 border-cyan-600/40 hover:bg-slate-800'
            }`}
          >
            <span>🧭 Trilha Direita (Descoberta)</span>
            {activePlayer.pathBranch === 'B' && <span className="text-[9px] bg-slate-900 text-cyan-400 px-1.5 py-0.5 rounded font-black">Ativo</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative bg-slate-950 scrollbar-none" ref={containerRef}>
      {/* Visual forest background ambient decoration elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950 opacity-90 pointer-events-none z-0" />
      
      {/* Animated stars and ambient trees decorations */}
      <div className="absolute top-[350px] left-[10%] opacity-15 text-white font-extrabold text-[10px] z-0 select-none flex flex-col items-center">🌲🌲 <span className="text-[8px] font-normal">Floresta Leste</span></div>
      <div className="absolute top-[850px] right-[10%] opacity-15 text-white font-extrabold text-[10px] z-0 select-none flex flex-col items-center">⛰️⛺ <span className="text-[8px] font-normal">Pico das Estrelas</span></div>
      <div className="absolute top-[1850px] left-[8%] opacity-15 text-white font-extrabold text-[10px] z-0 select-none flex flex-col items-center">🌊🐟 <span className="text-[8px] font-normal">Rio das Pedras</span></div>
      <div className="absolute top-[2850px] right-[12%] opacity-15 text-white font-extrabold text-[10px] z-0 select-none flex flex-col items-center">🌲⛺🌲 <span className="text-[8px] font-normal">Base Escoteira</span></div>
      <div className="absolute top-[4250px] left-[15%] opacity-15 text-white font-extrabold text-[10px] z-0 select-none flex flex-col items-center">🎒🦉 <span className="text-[8px] font-normal">Santuário Natural</span></div>

      {/* Sinuous SVG connections line */}
      {renderPathSVG()}

      {/* Sinuous cells track */}
      <div className="relative w-full h-[6200px] z-20">
        {renderCells()}
        {renderPawns()}
      </div>

      {/* Floating Bifurcation decision overlays */}
      {renderPathSelector()}
    </div>
  );
};

export default BetaGameBoard;
