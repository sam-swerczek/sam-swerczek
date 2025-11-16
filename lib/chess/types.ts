export type ChessPiece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type ChessColor = 'w' | 'b';

export interface ChessMove {
  from: string;
  to: string;
  promotion?: ChessPiece;
  san?: string; // Standard Algebraic Notation (e.g., "Nf3", "e4")
}

export interface GameState {
  fen: string;
  turn: ChessColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: ChessMove[];
}

export type GameResult = 'white-win' | 'black-win' | 'draw' | 'in-progress';

export interface AIMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface ChessEngineConfig {
  level: number; // 1-4, where 2-3 is approximately 1300 Elo
}
