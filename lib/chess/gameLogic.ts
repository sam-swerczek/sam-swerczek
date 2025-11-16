import { Chess } from 'chess.js';
import type { GameState, ChessMove } from './types';

/**
 * Creates a new chess game instance
 */
export function createChessGame(): Chess {
  return new Chess();
}

/**
 * Gets the current game state from a Chess instance
 */
export function getGameState(game: Chess): GameState {
  return {
    fen: game.fen(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    moveHistory: game.history({ verbose: true }).map((move) => ({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
      san: move.san,
    })),
  };
}

/**
 * Validates and makes a move on the chess board
 */
export function makeMove(
  game: Chess,
  move: ChessMove
): { success: boolean; error?: string } {
  try {
    const result = game.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    });

    if (result === null) {
      return {
        success: false,
        error: 'Invalid move',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Undoes the last move
 */
export function undoMove(game: Chess): boolean {
  const move = game.undo();
  return move !== null;
}

/**
 * Resets the game to the initial position
 */
export function resetGame(game: Chess): void {
  game.reset();
}

/**
 * Loads a game from a FEN string
 */
export function loadFEN(game: Chess, fen: string): boolean {
  try {
    game.load(fen);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all legal moves for the current position
 */
export function getLegalMoves(game: Chess): string[] {
  return game.moves();
}

/**
 * Gets all legal moves for a specific square
 */
export function getLegalMovesForSquare(game: Chess, square: string): string[] {
  return game.moves({ square: square as any, verbose: true }).map((m) => m.to);
}

/**
 * Determines the game result message
 */
export function getGameResultMessage(state: GameState): string | null {
  if (state.isCheckmate) {
    return state.turn === 'w' ? 'Checkmate! Black wins!' : 'Checkmate! You win!';
  }
  if (state.isStalemate) {
    return 'Draw by stalemate';
  }
  if (state.isDraw) {
    return 'Draw';
  }
  return null;
}
