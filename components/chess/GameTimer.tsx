interface GameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: 'w' | 'b';
}

export default function GameTimer({ whiteTime, blackTime, currentTurn }: GameTimerProps) {
  // Format time from milliseconds to MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background-secondary/30 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-4">
      <h2 className="text-lg font-bold text-text-primary mb-3 font-montserrat">
        Time Controls
      </h2>

      <div className="space-y-3">
        {/* Black (AI) Timer */}
        <div
          className={`p-3 rounded-lg transition-all duration-300 ${
            currentTurn === 'b'
              ? 'bg-accent-blue/20 border-2 border-accent-blue/50'
              : 'bg-background-secondary/20 border border-accent-blue/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm font-medium">Black (AI)</span>
            <span
              className={`font-mono text-xl font-bold ${
                blackTime < 30000
                  ? 'text-red-400'
                  : blackTime < 60000
                  ? 'text-yellow-400'
                  : 'text-text-primary'
              }`}
            >
              {formatTime(blackTime)}
            </span>
          </div>
        </div>

        {/* White (You) Timer */}
        <div
          className={`p-3 rounded-lg transition-all duration-300 ${
            currentTurn === 'w'
              ? 'bg-accent-teal/20 border-2 border-accent-teal/50'
              : 'bg-background-secondary/20 border border-accent-blue/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm font-medium">White (You)</span>
            <span
              className={`font-mono text-xl font-bold ${
                whiteTime < 30000
                  ? 'text-red-400'
                  : whiteTime < 60000
                  ? 'text-yellow-400'
                  : 'text-text-primary'
              }`}
            >
              {formatTime(whiteTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-text-secondary text-center">
        5 minutes each, no increment
      </div>
    </div>
  );
}
