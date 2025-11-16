import { RotateCcw, Flag } from 'lucide-react';
import { getDifficultyDescription } from '@/lib/chess/aiEngine';

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  isGameOver: boolean;
  aiLevel: number;
  onAiLevelChange: (level: number) => void;
}

export default function GameControls({
  onNewGame,
  onResign,
  isGameOver,
  aiLevel,
  onAiLevelChange,
}: GameControlsProps) {
  return (
    <div className="bg-background-secondary/50 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-4">
      <div className="space-y-3">
        <h3 className="text-text-primary font-semibold text-sm mb-3">Game Controls</h3>

        {/* AI Difficulty Dropdown */}
        <div className="space-y-1">
          <label htmlFor="ai-difficulty" className="text-text-secondary text-xs font-medium">
            AI Difficulty
          </label>
          <select
            id="ai-difficulty"
            value={aiLevel}
            onChange={(e) => onAiLevelChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-background-secondary/50 border border-accent-blue/30 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
          >
            <option value={1}>Level 1 - {getDifficultyDescription(1)}</option>
            <option value={2}>Level 2 - {getDifficultyDescription(2)}</option>
            <option value={3}>Level 3 - {getDifficultyDescription(3)}</option>
            <option value={4}>Level 4 - {getDifficultyDescription(4)}</option>
          </select>
        </div>

        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 hover:border-accent-blue/50 text-accent-blue rounded-lg transition-all duration-300 font-medium text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>

        {/* Resign Button */}
        <button
          onClick={onResign}
          disabled={isGameOver}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-gold/10 hover:bg-accent-gold/20 border border-accent-gold/30 hover:border-accent-gold/50 text-accent-gold rounded-lg transition-all duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-gold/10 disabled:hover:border-accent-gold/30"
        >
          <Flag className="w-4 h-4" />
          Resign
        </button>
      </div>
    </div>
  );
}
