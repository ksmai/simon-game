import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Color } from '../../../models/color';
import { GameService } from '../../core/game.service';

@Component({
  selector: 'simon-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit, OnDestroy {
  isOn$: Observable<boolean>;
  isStrictMode$: Observable<boolean>;
  score$: Observable<string>;
  canResetSubscription: Subscription;
  canReset: boolean;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.isOn$ = this.gameService.getIsOn();
    this.isStrictMode$ = this.gameService.getIsStrictMode();
    this.score$ = this.gameService.getScore();
    this.canResetSubscription = this.gameService
      .getDisplayedColor()
      .map((color: Color) => color === null)
      .subscribe((canReset: boolean) => this.canReset = canReset);
  }

  ngOnDestroy() {
    if (this.canResetSubscription) {
      this.canResetSubscription.unsubscribe();
    }
  }

  toggleOn(): void {
    if (this.canReset) {
      this.gameService.toggleOn();
    }
  }

  toggleStrict(): void {
    this.gameService.toggleStrictMode();
  }

  onReset(): void {
    if (this.canReset) {
      this.gameService.resetGame();
    }
  }
}
