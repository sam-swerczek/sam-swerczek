'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

import {
  createChessGame,
  getGameState,
  makeMove,
  undoMove,
  resetGame,
  getLegalMovesForSquare,
} from '@/lib/chess/gameLogic';
import { getAIMove } from '@/lib/chess/aiEngine';
import type { ChessMove, GameState } from '@/lib/chess/types';

import GameStatus from './GameStatus';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import LichessChallenge from './LichessChallenge';
import GameTimer from './GameTimer';

export default function ChessGame() {
  // Initialize chess game instance
  const game = useMemo(() => createChessGame(), []);

  // Game state
  const [gameState, setGameState] = useState<GameState>(() => getGameState(game));
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Timer state (in milliseconds) - 5 minutes each
  const [whiteTime, setWhiteTime] = useState(5 * 60 * 1000);
  const [blackTime, setBlackTime] = useState(5 * 60 * 1000);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Move highlighting state
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  // Update game state helper
  const updateGameState = useCallback(() => {
    setGameState(getGameState(game));
  }, [game]);

  // Clear selection and valid moves
  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, []);

  // Handle player move (both drag-drop and click-click)
  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece: string | null): boolean => {
      // Don't allow moves if piece is null
      if (!piece) {
        return false;
      }

      // Don't allow moves if game is over or AI is thinking
      if (gameState.isGameOver || isAIThinking) {
        return false;
      }

      // Don't allow moves when it's black's turn (AI's turn)
      if (gameState.turn === 'b') {
        return false;
      }

      // Don't allow moves if out of time
      if (whiteTime <= 0) {
        return false;
      }

      const move: ChessMove = {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      };

      const result = makeMove(game, move);

      if (result.success) {
        // Start timer on first move
        if (!isTimerRunning) {
          setIsTimerRunning(true);
        }
        updateGameState();
        clearSelection();
        return true;
      }

      return false;
    },
    [game, gameState.isGameOver, gameState.turn, isAIThinking, isTimerRunning, whiteTime, updateGameState, clearSelection]
  );

  // Handle square click for move highlighting and click-to-move
  const onSquareClick = useCallback(
    (square: string | null) => {
      // Don't allow interaction if square is null
      if (!square) {
        return;
      }

      // Don't allow interaction if game is over or AI is thinking
      if (gameState.isGameOver || isAIThinking || gameState.turn === 'b') {
        return;
      }

      // If a square is already selected
      if (selectedSquare) {
        // If clicking the same square, deselect it
        if (selectedSquare === square) {
          clearSelection();
          return;
        }

        // If clicking a valid move, make the move
        if (validMoves.includes(square)) {
          const move: ChessMove = {
            from: selectedSquare,
            to: square,
            promotion: 'q', // Always promote to queen for simplicity
          };

          const result = makeMove(game, move);

          if (result.success) {
            // Start timer on first move
            if (!isTimerRunning) {
              setIsTimerRunning(true);
            }
            updateGameState();
            clearSelection();
          }
          return;
        }

        // Otherwise, select the new square (if it has a white piece)
        const piece = game.get(square as Square);
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
          const moves = getLegalMovesForSquare(game, square);
          setValidMoves(moves);
        } else {
          clearSelection();
        }
      } else {
        // No square selected, check if clicked square has a white piece
        const piece = game.get(square as Square);
        if (piece && piece.color === 'w') {
          const moves = getLegalMovesForSquare(game, square);
          setSelectedSquare(square);
          setValidMoves(moves);
        }
      }
    },
    [game, gameState.isGameOver, gameState.turn, isAIThinking, isTimerRunning, selectedSquare, validMoves, updateGameState, clearSelection]
  );

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerRunning || gameState.isGameOver) return;

    const interval = setInterval(() => {
      if (gameState.turn === 'w') {
        setWhiteTime((prev) => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            setIsTimerRunning(false);
            alert('Time out! Black (AI) wins!');
            return 0;
          }
          return newTime;
        });
      } else {
        setBlackTime((prev) => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            setIsTimerRunning(false);
            alert('Time out! You win!');
            return 0;
          }
          return newTime;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning, gameState.turn, gameState.isGameOver]);

  // AI move effect with human-like thinking time
  useEffect(() => {
    const makeAIMove = async () => {
      // Only make AI move if it's black's turn and game is not over
      if (gameState.turn === 'b' && !gameState.isGameOver && !isAIThinking) {
        setIsAIThinking(true);
        clearSelection(); // Clear any player selection when AI is thinking

        // Calculate human-like thinking time
        // Most moves: 1-7 seconds, tough positions: up to 12 seconds
        // Use weighted random: 70% chance of 1-7s, 30% chance of 7-12s
        const isComplexPosition = Math.random() < 0.3;
        const thinkingTime = isComplexPosition
          ? 7000 + Math.random() * 5000 // 7-12 seconds for complex positions
          : 1000 + Math.random() * 6000; // 1-7 seconds for normal moves

        await new Promise((resolve) => setTimeout(resolve, thinkingTime));

        try {
          const aiMove = await getAIMove(gameState.fen, { level: 1 });

          if (aiMove) {
            const move: ChessMove = {
              from: aiMove.from as Square,
              to: aiMove.to as Square,
            };

            const result = makeMove(game, move);

            if (result.success) {
              updateGameState();
            }
          }
        } catch (error) {
          // Silently handle AI move errors in production
        } finally {
          setIsAIThinking(false);
        }
      }
    };

    makeAIMove();
  }, [game, gameState.turn, gameState.isGameOver, gameState.fen, isAIThinking, updateGameState, clearSelection]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    resetGame(game);
    updateGameState();
    setIsAIThinking(false);
    clearSelection();
    // Reset timers
    setWhiteTime(5 * 60 * 1000);
    setBlackTime(5 * 60 * 1000);
    setIsTimerRunning(false);
  }, [game, updateGameState, clearSelection]);

  // Handle undo move (undo both player and AI move)
  const handleUndo = useCallback(() => {
    if (gameState.moveHistory.length === 0) return;

    // Undo AI move
    undoMove(game);
    // Undo player move
    undoMove(game);

    updateGameState();
    setIsAIThinking(false);
    clearSelection();

    // If we undo to the start, stop the timer
    if (gameState.moveHistory.length <= 2) {
      setIsTimerRunning(false);
      setWhiteTime(5 * 60 * 1000);
      setBlackTime(5 * 60 * 1000);
    }
  }, [game, gameState.moveHistory.length, updateGameState, clearSelection]);

  // Handle resign
  const handleResign = useCallback(() => {
    if (window.confirm('Are you sure you want to resign?')) {
      alert('You resigned. Black (AI) wins!');
      handleNewGame();
    }
  }, [handleNewGame]);

  // Create custom square styles for move highlighting
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight king in check
    if (gameState.isCheck) {
      // Find the king's square
      const board = game.board();
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece && piece.type === 'k' && piece.color === gameState.turn) {
            const files = 'abcdefgh';
            const kingSquare = `${files[col]}${8 - row}`;
            styles[kingSquare] = {
              backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red background for check
              boxShadow: 'inset 0 0 0 4px rgba(255, 0, 0, 0.8)', // Red border
            };
            break;
          }
        }
      }
    }

    // Highlight selected square with teal border
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(61, 214, 208, 0.4)', // accent-teal with 40% opacity
        boxShadow: 'inset 0 0 0 3px #3dd6d0', // accent-teal border
      };
    }

    // Highlight valid move squares
    validMoves.forEach((square) => {
      styles[square] = {
        backgroundColor: 'rgba(61, 214, 208, 0.25)', // accent-teal with 25% opacity
        borderRadius: '50%',
        backgroundImage: 'radial-gradient(circle, rgba(61, 214, 208, 0.5) 20%, transparent 20%)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    });

    return styles;
  }, [selectedSquare, validMoves, gameState.isCheck, gameState.turn, game]);

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Game Board and Controls */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chess Board */}
          <div className="lg:col-span-2">
            <div className="bg-background-secondary/30 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-4 md:p-6">
              <div className="aspect-square max-w-2xl mx-auto">
                <Chessboard
                  options={{
                    position: gameState.fen,
                    onPieceDrop: ({ piece, sourceSquare, targetSquare }) => {
                      // @ts-expect-error react-chessboard v5 types piece as string | null, but we handle null in onDrop
                      return onDrop(sourceSquare, targetSquare, piece);
                    },
                    onSquareClick: ({ square }) => {
                      onSquareClick(square);
                    },
                    onPieceClick: ({ square }) => {
                      onSquareClick(square);
                    },
                    boardOrientation: 'white',
                    boardStyle: {
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(74, 158, 255, 0.2)',
                    },
                    darkSquareStyle: {
                      backgroundColor: '#769656',
                    },
                    lightSquareStyle: {
                      backgroundColor: '#eeeed2',
                    },
                    squareStyles: customSquareStyles,
                    allowDragging: !gameState.isGameOver && !isAIThinking && gameState.turn === 'w',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Game Info */}
          <div className="space-y-4">
            {/* Game Timer */}
            <GameTimer whiteTime={whiteTime} blackTime={blackTime} currentTurn={gameState.turn} />

            {/* Game Status */}
            <GameStatus gameState={gameState} isAIThinking={isAIThinking} />

            {/* Game Controls */}
            <GameControls
              onNewGame={handleNewGame}
              onUndo={handleUndo}
              onResign={handleResign}
              canUndo={gameState.moveHistory.length >= 2}
              isGameOver={gameState.isGameOver}
            />

            {/* Move History */}
            <MoveHistory moves={gameState.moveHistory} />

            {/* Lichess Challenge */}
            <LichessChallenge />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-background-secondary/30 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary mb-3 font-montserrat">
            How to Play
          </h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent-blue font-bold mt-1">•</span>
              <span>You play as White. Click or drag pieces to make your move.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue font-bold mt-1">•</span>
              <span>The AI will respond automatically after your move.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue font-bold mt-1">•</span>
              <span>Use the Undo button to take back your last move (undoes both your move and the AI&apos;s response).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue font-bold mt-1">•</span>
              <span>Pawns automatically promote to Queens when reaching the back rank.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
