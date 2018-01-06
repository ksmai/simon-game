import { Color } from './color';

export class Game {
  sequence: Color[];

  constructor(public maxTurn: number = 20) {
    this.sequence = [];
  }

  generateNextColor(): void {
    const nextColor: Color = Math.floor(Math.random() * 4) as Color;
    this.sequence = this.sequence.concat(nextColor);
  }

  reset(): void {
    this.sequence = [];
  }

  isValidGuess(colors: Color[]): boolean {
    if (colors.length > this.sequence.length) {
      return false;
    }
    return colors.every((color, i) => color === this.sequence[i]);
  }

  hasWon(): boolean {
    return this.sequence.length > this.maxTurn;
  }
}
