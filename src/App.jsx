import React, { useState, useEffect } from 'react';
import { generateBoard } from './logic/boardGenerator';
import LoginScreen from './components/LoginScreen';
import GameBoard from './components/GameBoard';
import GameHeader from './components/GameHeader';
import Dice from './components/Dice';
import ModalEvent from './components/ModalEvent';
import VictoryScreen from './components/VictoryScreen';
import { getRandomPenalty, getRandomBonus } from './logic/events';
import { getRandomQuiz } from './logic/quiz';

function App() {
  const [gameState, setGameState] = useState('LOGIN'); // LOGIN, PLAYING, FINISHED
  const [players, setPlayers] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(0);
  const [board, setBoard] = useState([]);
  
  const [currentEvent, setCurrentEvent] = useState(null); // { type, data }
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  
  const [usedQuizIds, setUsedQuizIds] = useState([]);
  const [isAnimatingMovement, setIsAnimatingMovement] = useState(false);

  useEffect(() => {
    if (gameState === 'PLAYING' && board.length === 0) {
      setBoard(generateBoard());
    }
  }, [gameState, board.length]);

  const startGame = (activePlayers) => {
    setPlayers(activePlayers);
    setCurrentPlayerId(0);
    setBoard(generateBoard());
    setUsedQuizIds([]);
    setLastRoll(null);
    setGameState('PLAYING');
  };

  const restartGame = () => {
    setPlayers([]);
    setCurrentPlayerId(0);
    setBoard([]);
    setCurrentEvent(null);
    setLastRoll(null);
    setUsedQuizIds([]);
    setGameState('LOGIN');
  };

  const handleRollDice = () => {
    if (isRolling || currentEvent || gameState !== 'PLAYING' || isAnimatingMovement) return;

    setIsRolling(true);
    setLastRoll(null);

    // Turn off dice rolling after animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setLastRoll(roll);
      setIsRolling(false);
      
      // Begin step-by-step walking animation
      animatePlayerMovement(currentPlayerId, roll);
    }, 1500);
  };

  // Step-by-step movement animation
  const animatePlayerMovement = (playerId, steps, onComplete = null) => {
    setIsAnimatingMovement(true);
    let stepsLeft = Math.abs(steps);
    const direction = steps > 0 ? 1 : -1;

    const interval = setInterval(() => {
      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.id === playerId) {
            let nextPos = p.position + direction;
            if (nextPos < 0) nextPos = 0;
            if (nextPos > 60) nextPos = 60;
            return { ...p, position: nextPos };
          }
          return p;
        });
      });

      stepsLeft--;

      // Get updated active player position
      setPlayers((currentPlayers) => {
        const active = currentPlayers.find(p => p.id === playerId);
        
        if (stepsLeft <= 0 || active.position === 60 || (direction === -1 && active.position === 0)) {
          clearInterval(interval);
          setIsAnimatingMovement(false);

          // Evaluate once player finishes walking
          if (active.position === 60) {
            setGameState('FINISHED');
          } else {
            if (onComplete) {
              onComplete(active.position);
            } else {
              processCell(playerId, active.position);
            }
          }
        }
        return currentPlayers;
      });

    }, 600); // Move every 600ms for a clear, rhythmic walking feel
  };

  const processCell = (playerId, pos) => {
    const cell = board[pos];
    const player = players.find(p => p.id === playerId);
    if (!cell || !player) return;

    switch (cell.type) {
      case 'PENALTY':
        setCurrentEvent({ type: 'PENALTY', data: getRandomPenalty() });
        break;
      case 'BONUS':
        setCurrentEvent({ type: 'BONUS', data: getRandomBonus() });
        break;
      case 'QUIZ_FISICO': {
        const quiz = getRandomQuiz("FÍSICO", usedQuizIds);
        setUsedQuizIds(prev => [...prev, quiz.id]);
        setCurrentEvent({ type: 'QUIZ', data: quiz });
        break;
      }
      case 'QUIZ_MENTAL': {
        const quiz = getRandomQuiz("MENTAL", usedQuizIds);
        setUsedQuizIds(prev => [...prev, quiz.id]);
        setCurrentEvent({ type: 'QUIZ', data: quiz });
        break;
      }
      case 'QUIZ_ESPIRITUAL': {
        const quiz = getRandomQuiz("ESPIRITUAL", usedQuizIds);
        setUsedQuizIds(prev => [...prev, quiz.id]);
        setCurrentEvent({ type: 'QUIZ', data: quiz });
        break;
      }
      default:
        // START or FINISH - change turns immediately
        nextTurn();
        break;
    }
  };

  const nextTurn = () => {
    setCurrentPlayerId((prevId) => (prevId + 1) % players.length);
  };

  const handleCloseEvent = (result) => {
    if (!result) {
      setCurrentEvent(null);
      nextTurn();
      return;
    }

    let skipTurnChange = false;

    // Apply score changes
    if (result.pupChange) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === currentPlayerId ? { ...p, score: p.score + result.pupChange } : p
        )
      );
    }

    // Handle playAgain bonus exception
    if (result.playAgain) {
      skipTurnChange = true;
    }

    // Apply step consequences if the event has them
    if (result.stepChange) {
      skipTurnChange = true; // Let the step finish before turn switches
      setTimeout(() => {
        animatePlayerMovement(currentPlayerId, result.stepChange, (finalPos) => {
          if (result.stepChange < 0) {
            // Se for punição de voltar casas, não aplica a pergunta/evento da nova casa e passa o turno
            nextTurn();
          } else {
            // Se for avanço de casas, processa a casa de destino
            processCell(currentPlayerId, finalPos);
          }
        });
      }, 500);
    }

    setCurrentEvent(null);

    // If turn changes immediately
    if (!skipTurnChange) {
      nextTurn();
    }
  };

  const activePlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="min-h-screen bg-desbrava-sand font-sans flex flex-col items-center overflow-hidden">
      {gameState === 'LOGIN' && <LoginScreen onStart={startGame} />}
      
      {gameState === 'PLAYING' && players.length > 0 && (
        <div className="w-full max-w-lg mx-auto flex flex-col h-screen relative shadow-2xl bg-white/50">
          <GameHeader players={players} currentPlayerId={currentPlayerId} />
          
          <GameBoard 
            board={board} 
            players={players} 
            currentPlayerId={currentPlayerId} 
          />

          <div className="bg-desbrava-green p-4 border-t-4 border-desbrava-yellow flex justify-center items-center shadow-[0_-4px_6px_rgba(0,0,0,0.1)] z-10 shrink-0">
            <Dice 
              onRoll={handleRollDice} 
              isRolling={isRolling} 
              disabled={currentEvent !== null || isAnimatingMovement} 
              lastRoll={lastRoll}
              activePlayer={activePlayer}
            />
          </div>

          {currentEvent && (
            <ModalEvent event={currentEvent} onClose={handleCloseEvent} />
          )}
        </div>
      )}

      {gameState === 'FINISHED' && (
        <VictoryScreen players={players} onRestart={restartGame} />
      )}
    </div>
  );
}

export default App;
