import type { GameState } from '@/lib/chess/types';
import { getGameResultMessage } from '@/lib/chess/gameLogic';

interface GameStatusProps {
  gameState: GameState;
  isAIThinking: boolean;
}

export default function GameStatus({ gameState, isAIThinking }: GameStatusProps) {
  const resultMessage = getGameResultMessage(gameState);

  return (
    <div className="bg-background-secondary/50 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-4">
      <div className="space-y-3">
        {/* Current Turn */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm font-medium">Turn:</span>
          <span className="text-text-primary font-semibold">
            {gameState.turn === 'w' ? 'White (You)' : 'Black (AI)'}
          </span>
        </div>

        {/* Game Status */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm font-medium">Status:</span>
          <div className="flex items-center gap-2">
            {isAIThinking && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-teal rounded-full animate-pulse" />
                <span className="text-accent-teal text-sm font-medium">AI Thinking...</span>
              </div>
            )}
            {!isAIThinking && gameState.isCheck && !gameState.isGameOver && (
              <span className="text-accent-gold text-sm font-semibold px-2 py-1 bg-accent-gold/10 rounded border border-accent-gold/30">
                Check!
              </span>
            )}
            {!isAIThinking && !gameState.isCheck && !gameState.isGameOver && (
              <span className="text-text-primary text-sm">In Progress</span>
            )}
          </div>
        </div>

        {/* Game Result */}
        {resultMessage && (
          <div className="mt-3 pt-3 border-t border-accent-blue/20">
            <div className="text-center">
              <p className="text-accent-blue font-bold text-lg">{resultMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
