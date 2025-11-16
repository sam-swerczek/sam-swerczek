declare module 'js-chess-engine' {
  export class Game {
    constructor(fen?: string);
    aiMove(level: number): Record<string, string>;
    move(from: string, to: string): Record<string, string>;
  }
}
