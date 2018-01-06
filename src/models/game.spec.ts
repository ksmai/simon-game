import { Game } from './game';
import { Color } from './color';

describe('Game', () => {
  let game: Game;
  const MAX_TURN = 10;

  beforeEach(() => {
    game = new Game(MAX_TURN);
  });

  it('should initialize with empty sequence', () => {
    expect(game.sequence).toEqual([]);
  });

  it('should add colors to sequence', () => {
    expect(game.sequence.length).toEqual(0);
    game.generateNextColor();
    expect(game.sequence.length).toEqual(1);
    game.generateNextColor();
    expect(game.sequence.length).toEqual(2);
  });

  it('should generate valid colors', () => {
    for (let i = 0; i < 10; i++) {
      game.generateNextColor();
      const color = game.sequence[i];
      const isValidColor = [
        Color.BLUE,
        Color.RED,
        Color.GREEN,
        Color.YELLOW,
      ].includes(color);
      expect(isValidColor).toBe(true);
    }
  });

  it('should reset the sequence', () => {
    expect(game.sequence).toEqual([]);
    game.generateNextColor();
    expect(game.sequence).not.toEqual([]);
    game.reset();
    expect(game.sequence).toEqual([]);
  });

  it('should return true for valid guesses', () => {
    const guesses: Array<{ guess: Color[], sequence: Color[] }> = [
      { guess: [] as Color[], sequence: [] as Color[] },
      { guess: [], sequence: [Color.BLUE] },
      { guess: [Color.BLUE], sequence: [Color.BLUE] },
      { guess: [Color.RED], sequence: [Color.RED, Color.BLUE, Color.GREEN] },
      { guess: [Color.RED, Color.BLUE], sequence: [Color.RED, Color.BLUE, Color.GREEN] },
    ];

    for (let pair of guesses) {
      game.sequence = pair.sequence;
      const isValid = game.isValidGuess(pair.guess);
      expect(isValid).toBe(true);
    }
  });

  it('should return false for invalid guesses', () => {
    const guesses: Array<{ guess: Color[], sequence: Color[] }> = [
      { guess: [Color.RED], sequence: [Color.BLUE] },
      { guess: [Color.BLUE], sequence: [Color.RED, Color.BLUE, Color.GREEN] },
      { guess: [Color.RED, Color.BLUE, Color.YELLOW], sequence: [Color.RED, Color.BLUE, Color.GREEN] },
    ];

    for (let pair of guesses) {
      game.sequence = pair.sequence;
      const isValid = game.isValidGuess(pair.guess);
      expect(isValid).toBe(false);
    }
  });

  it('should win after MAX_TURN has passed', () => {
    for (let i = 0; i < MAX_TURN; i++) {
      game.generateNextColor();
      expect(game.hasWon()).toBe(false);
    }
    game.generateNextColor();
    expect(game.hasWon()).toBe(true);
  });
});
