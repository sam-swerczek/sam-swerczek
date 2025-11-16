import type { ChessMove } from '@/lib/chess/types';

interface MoveHistoryProps {
  moves: ChessMove[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  // Group moves into pairs (white move, black move)
  const movePairs: Array<{ moveNumber: number; white?: string; black?: string }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i]?.san,
      black: moves[i + 1]?.san,
    });
  }

  return (
    <div className="bg-background-secondary/50 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-4">
      <h3 className="text-text-primary font-semibold text-sm mb-3">Move History</h3>

      {moves.length === 0 ? (
        <p className="text-text-secondary text-sm italic">No moves yet</p>
      ) : (
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {movePairs.map((pair) => (
              <div
                key={pair.moveNumber}
                className="flex items-center gap-3 text-sm py-1 px-2 rounded hover:bg-background-secondary/50 transition-colors"
              >
                <span className="text-text-secondary font-medium w-6 text-right">
                  {pair.moveNumber}.
                </span>
                <span className="text-text-primary font-mono min-w-[60px]">
                  {pair.white || ''}
                </span>
                {pair.black && (
                  <span className="text-text-primary font-mono min-w-[60px]">
                    {pair.black}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
