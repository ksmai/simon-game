import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/combineLatest';

import { Game } from '../../models/game';
import { Color } from '../../models/color';

@Injectable()
export class GameService {
  private MAX_TURN = 20;
  private DISPLAY_INTERVAL = 1000;
  private game: Game;
  private hasWon$: BehaviorSubject<boolean>;
  private isOn$: BehaviorSubject<boolean>;
  private isStrictMode$: BehaviorSubject<boolean>;
  private displayedColor$: BehaviorSubject<Color | null>;
  private currentSequence$: BehaviorSubject<Color[]>;
  private currentGuesses: Color[];

  constructor() {
    this.game = new Game(this.MAX_TURN);
    this.hasWon$ = new BehaviorSubject<boolean>(this.game.hasWon());
    this.isOn$ = new BehaviorSubject<boolean>(false);
    this.isStrictMode$ = new BehaviorSubject<boolean>(false);
    this.displayedColor$ = new BehaviorSubject<Color | null>(null);
    this.currentSequence$ = new BehaviorSubject<Color[]>(this.game.sequence);
  }

  getDisplayedColor(): Observable<Color | null> {
    return Observable.zip(
      this.displayedColor$.asObservable(),
      Observable.interval(this.DISPLAY_INTERVAL),
      (c: Color | null, i: number) => c,
    );
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
    if (typeof isOn !== 'boolean') {
      isOn = !this.isOn$.value;
    }
    this.isOn$.next(isOn);
  }

  toggleStrictMode(isStrict?: boolean): void {
    if (typeof isStrict !== 'boolean') {
      isStrict = !this.isStrictMode$.value;
    }
    this.isStrictMode$.next(isStrict);
  }

  private handleWrongGuesses(): void {
    if (this.isStrictMode$.value) {
      this.resetGame();
      this.nextTurn();
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
    this.game.sequence.forEach((color: Color) => {
      this.displayedColor$.next(color);
    });
    this.displayedColor$.next(null);
  }

  private resetGame(): void {
    this.game.reset();
    this.currentSequence$.next(this.game.sequence);
    this.currentGuesses = [];
  }
}
