import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/pairwise';

import { Game } from '../../models/game';
import { Color } from '../../models/color';

@Injectable()
export class GameService {
  private MAX_TURN = 20;
  private DISPLAY_INTERVAL = 500;
  private game: Game;
  private hasWon$: BehaviorSubject<boolean>;
  private isOn$: BehaviorSubject<boolean>;
  private isStrictMode$: BehaviorSubject<boolean>;
  private displayedColor$: ReplaySubject<Color | null>;
  private currentSequence$: BehaviorSubject<Color[]>;
  private currentGuesses: Color[];

  constructor() {
    this.game = new Game(this.MAX_TURN);
    this.hasWon$ = new BehaviorSubject<boolean>(this.game.hasWon());
    this.isOn$ = new BehaviorSubject<boolean>(false);
    this.isStrictMode$ = new BehaviorSubject<boolean>(false);
    this.displayedColor$ = new ReplaySubject<Color | null>(2);
    this.displayedColor$.next(null);
    this.displayedColor$.next(null);
    this.currentSequence$ = new BehaviorSubject<Color[]>(this.game.sequence);
  }

  getDisplayedColor(): Observable<Color | null> {
    return this.displayedColor$.asObservable()
      .pairwise()
      .concatMap(([prev, next]: [Color|null, Color|null]) => {
        if (prev === null && next !== null) {
          return Observable.of(next);
        }
        return Observable.of(next).delay(this.DISPLAY_INTERVAL);
      });
  }

  getIsOn(): Observable<boolean> {
    return this.isOn$.asObservable();
  }

  getHasWon(): Observable<boolean> {
    return this.hasWon$.asObservable();
  }

  getIsStrictMode(): Observable<boolean> {
    return this.isStrictMode$.asObservable();
  }

  getScore(): Observable<string> {
    return Observable.combineLatest(
      this.hasWon$,
      this.currentSequence$,
      (won, seq) => {
        if (won) {
          return '--';
        }
        const score = seq.length.toString();
        if (score.length < 2) {
          return `0${score}`;
        }
        return score;
      },
    );
  }

  guess(color: Color): void {
    this.currentGuesses = this.currentGuesses.concat(color);
    if (this.game.isValidGuess(this.currentGuesses)) {
      if (this.game.sequence.length === this.currentGuesses.length) {
        this.nextTurn();
      }
    } else {
      this.handleWrongGuesses();
    }
  }

  toggleOn(isOn?: boolean): void {
    const prevIsOn = this.isOn$.value;
    if (typeof isOn !== 'boolean') {
      isOn = !prevIsOn;
    }
    this.isOn$.next(isOn);
    if (!prevIsOn && isOn) {
      this.resetGame();
    }
  }

  toggleStrictMode(isStrict?: boolean): void {
    if (typeof isStrict !== 'boolean') {
      isStrict = !this.isStrictMode$.value;
    }
    this.isStrictMode$.next(isStrict);
  }

  resetGame(): void {
    this.game.reset();
    this.currentSequence$.next(this.game.sequence);
    this.hasWon$.next(this.game.hasWon());
    this.nextTurn();
  }

  private handleWrongGuesses(): void {
    this.currentGuesses = [];
    if (this.isStrictMode$.value) {
      this.resetGame();
    } else {
      this.displayColors();
    }
  }

  private nextTurn(): void {
    this.game.generateNextColor();
    this.currentGuesses = [];
    if (this.game.hasWon()) {
      this.hasWon$.next(true);
    } else {
      this.currentSequence$.next(this.game.sequence);
      this.displayColors();
    }
  }

  private displayColors(): void {
    this.displayedColor$.next(Color.NONE);
    this.game.sequence.forEach((color: Color) => {
      this.displayedColor$.next(Color.NONE);
      this.displayedColor$.next(color);
    });
    this.displayedColor$.next(null);
  }
}
