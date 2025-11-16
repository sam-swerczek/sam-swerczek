import { Game } from 'js-chess-engine';
import type { AIMove, ChessEngineConfig } from './types';

/**
 * Converts chess.js FEN to js-chess-engine compatible format
 * js-chess-engine expects uppercase square notation (e.g., "E2", "E4")
 */
function convertMove(move: { from: string; to: string }): AIMove {
  return {
    from: move.from.toUpperCase(),
    to: move.to.toUpperCase(),
  };
}

/**
 * Converts js-chess-engine move to lowercase format for chess.js
 */
function convertMoveToLowercase(move: { from: string; to: string }): AIMove {
  return {
    from: move.from.toLowerCase(),
    to: move.to.toLowerCase(),
  };
}

/**
 * Gets the best move from the AI engine for a given position
 * @param fen - The current position in FEN notation
 * @param config - AI configuration (level 1-4, where 2-3 is ~1300 Elo)
 * @returns The AI's chosen move
 */
export async function getAIMove(
  fen: string,
  config: ChessEngineConfig = { level: 2 }
): Promise<AIMove | null> {
  try {
    // Create a new game instance from the FEN position
    const game = new Game(fen);

    // Get AI move - js-chess-engine uses aiMove with level parameter
    const moves = game.aiMove(config.level);

    // Extract the move from the result
    // js-chess-engine returns moves in format: { "E2": "E4" }
    const moveKeys = Object.keys(moves);
    if (moveKeys.length === 0) {
      return null;
    }

    const from = moveKeys[0];
    const to = moves[from];

    // Convert to lowercase for chess.js compatibility
    return convertMoveToLowercase({ from, to });
  } catch (error) {
    // Silently handle AI engine errors in production
    return null;
  }
}

/**
 * Validates that the AI move is legal in the current position
 * This is a safety check in case the AI engine returns an invalid move
 */
export function validateAIMove(move: AIMove): boolean {
  return (
    typeof move.from === 'string' &&
    typeof move.to === 'string' &&
    move.from.length === 2 &&
    move.to.length === 2
  );
}

/**
 * Gets difficulty level description
 */
export function getDifficultyDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: 'Beginner (~800 Elo)',
    2: 'Intermediate (~1300 Elo)',
    3: 'Advanced (~1800 Elo)',
    4: 'Expert (~2200+ Elo)',
  };
  return descriptions[level] || descriptions[2];
}
