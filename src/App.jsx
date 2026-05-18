import React, { useState, useEffect } from 'react';
import { generateBoard } from './logic/boardGenerator';
import LoginScreen from './components/LoginScreen';
import GameBoard from './components/GameBoard';
import BetaGameBoard from './components/BetaGameBoard';
import GameHeader from './components/GameHeader';
import Dice from './components/Dice';
import ModalEvent from './components/ModalEvent';
import VictoryScreen from './components/VictoryScreen';
import { getRandomPenalty, getRandomBonus } from './logic/events';
import { getRandomQuiz, bancoPerguntas } from './logic/quiz';
import { syncQuestionsFromFirebase } from './logic/firebase';

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
  const [questionsBank, setQuestionsBank] = useState(bancoPerguntas);

  useEffect(() => {
    const syncQuestions = async () => {
      const synced = await syncQuestionsFromFirebase(bancoPerguntas);
      setQuestionsBank(synced);
    };
    syncQuestions();
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING' && board.length === 0) {
      setBoard(generateBoard());
    }
  }, [gameState, board.length]);

  const startGame = (activePlayers, isBeta = false) => {
    setPlayers(activePlayers);
    setCurrentPlayerId(0);
    setBoard(generateBoard());
    setUsedQuizIds([]);
    setLastRoll(null);
    setGameState(isBeta ? 'BETA_PLAYING' : 'PLAYING');
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

  // Step-by-step movement animation with mandatory stops at checkpoints
  const animatePlayerMovement = (playerId, steps, onComplete = null) => {
    setIsAnimatingMovement(true);
    let stepsLeft = Math.abs(steps);
    const direction = steps > 0 ? 1 : -1;
    const startPos = players.find(p => p.id === playerId)?.position || 0;
    const checkpoints = [15, 30, 45, 60];
    let hitCheckpoint = null;

    const interval = setInterval(() => {
      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.id === playerId) {
            let nextPos = p.position + direction;
            if (nextPos < 0) nextPos = 0;
            if (nextPos > 60) nextPos = 60;
            
            // Check if player crosses a checkpoint they weren't already on
            const crossedCP = checkpoints.find(cp => 
              (direction === 1 && startPos < cp && nextPos >= cp) ||
              (direction === -1 && startPos > cp && nextPos <= cp)
            );
            
            if (crossedCP !== undefined) {
              hitCheckpoint = crossedCP;
              return { ...p, position: crossedCP };
            }
            
            return { ...p, position: nextPos };
          }
          return p;
        });
      });

      stepsLeft--;

      // Get updated active player position
      setPlayers((currentPlayers) => {
        const active = currentPlayers.find(p => p.id === playerId);
        
        if (hitCheckpoint !== null || stepsLeft <= 0 || active.position === 60 || (direction === -1 && active.position === 0)) {
          clearInterval(interval);
          setIsAnimatingMovement(false);

          // Evaluate once player finishes walking
          if (hitCheckpoint !== null) {
            triggerCheckpointQuiz(playerId, hitCheckpoint);
          } else if (active.position === 60) {
            triggerCheckpointQuiz(playerId, 60);
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

  const triggerCheckpointQuiz = (playerId, checkpointPos) => {
    // Find all questions with images in the bank
    const imageQuestions = questionsBank.filter(q => q.imagem);
    if (imageQuestions.length === 0) {
      processCell(playerId, checkpointPos);
      return;
    }
    const randomIdx = Math.floor(Math.random() * imageQuestions.length);
    const quiz = imageQuestions[randomIdx];
    
    // Set mandatory checkpoint quiz
    setCurrentEvent({
      type: 'CHECKPOINT',
      data: {
        ...quiz,
        checkpoint: checkpointPos
      }
    });
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
        const quiz = getRandomQuiz("FÍSICO", usedQuizIds, questionsBank);
        setUsedQuizIds(prev => [...prev, quiz.id]);
        setCurrentEvent({ type: 'QUIZ', data: quiz });
        break;
      }
      case 'QUIZ_MENTAL': {
        const quiz = getRandomQuiz("MENTAL", usedQuizIds, questionsBank);
        setUsedQuizIds(prev => [...prev, quiz.id]);
        setCurrentEvent({ type: 'QUIZ', data: quiz });
        break;
      }
      case 'QUIZ_ESPIRITUAL': {
        const quiz = getRandomQuiz("ESPIRITUAL", usedQuizIds, questionsBank);
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
      // If player is at 60 (the final portal), close event ends game
      setPlayers((currentPlayers) => {
        const active = currentPlayers.find(p => p.id === currentPlayerId);
        if (active && active.position === 60) {
          setGameState('FINISHED');
        } else {
          nextTurn();
        }
        return currentPlayers;
      });
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

    // If game should end or turn changes
    setTimeout(() => {
      setPlayers((currentPlayers) => {
        const active = currentPlayers.find(p => p.id === currentPlayerId);
        if (active && active.position === 60) {
          setGameState('FINISHED');
        } else if (!skipTurnChange) {
          nextTurn();
        }
        return currentPlayers;
      });
    }, 100);
  };

  const activePlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="min-h-screen bg-desbrava-sand font-sans flex flex-col items-center overflow-hidden">
      {gameState === 'LOGIN' && <LoginScreen onStart={startGame} />}
      
      {(gameState === 'PLAYING' || gameState === 'BETA_PLAYING') && players.length > 0 && (
        <div className="w-full max-w-lg mx-auto flex flex-col h-screen relative shadow-2xl bg-white/50">
          <GameHeader players={players} currentPlayerId={currentPlayerId} />
          
          {gameState === 'BETA_PLAYING' ? (
            <BetaGameBoard 
              board={board} 
              players={players} 
              currentPlayerId={currentPlayerId} 
              onSelectPath={(playerId, path) => {
                setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, pathBranch: path } : p));
              }}
            />
          ) : (
            <GameBoard 
              board={board} 
              players={players} 
              currentPlayerId={currentPlayerId} 
            />
          )}

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
