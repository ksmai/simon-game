import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/bufferCount';
import { Observable } from 'rxjs/Observable';
import { GameService } from './game.service';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(() => {
    gameService = new GameService();
  });

  it('should initialize correctly', (done) => {
    Observable.combineLatest(
      gameService.getIsOn(),
      gameService.getHasWon(),
      gameService.getIsStrictMode(),
      gameService.getDisplayedColor(),
    ).subscribe(([on, won, strict, color]) => {
      expect(on).toBe(false);
      expect(won).toBe(false);
      expect(strict).toBe(false);
      expect(color).toBe(null);
      done();
    });
  });

  it('should toggleOn', (done) => {
    gameService.getIsOn().bufferCount(6).subscribe((ons: boolean[]) => {
      expect(ons).toEqual([false, true, false, false, true, false]);
      done();
    });

    gameService.toggleOn(true);
    gameService.toggleOn(false);
    gameService.toggleOn(false);
    gameService.toggleOn();
    gameService.toggleOn();
  });

  it('should toggleStrictMode', (done) => {
    gameService
      .getIsStrictMode()
      .bufferCount(6)
      .subscribe((stricts: boolean[]) => {
        expect(stricts).toEqual([false, true, false, false, true, false]);
        done();
      });

    gameService.toggleStrictMode(true);
    gameService.toggleStrictMode(false);
    gameService.toggleStrictMode(false);
    gameService.toggleStrictMode();
    gameService.toggleStrictMode();
  });
});
