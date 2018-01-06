import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Color } from '../../../models/color';
import { GameService } from '../../core/game.service';
import { SoundService } from '../../core/sound.service';

@Component({
  selector: 'simon-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnDestroy {
  @Input() color: Color;
  displayedColor: Color;
  hasWon: boolean;
  isOn: boolean;
  subscription: Subscription;

  constructor(
    private gameService: GameService,
    private soundService: SoundService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.gameService
      .getIsOn()
      .subscribe((isOn: boolean) => this.isOn = isOn);

    this.subscription.add(
      this.gameService
        .getHasWon()
        .subscribe((hasWon: boolean) => this.hasWon = hasWon),
    );

    this.subscription.add(
      this.gameService
        .getDisplayedColor()
        .subscribe((color: Color) => {
          if (color === this.color) {
            this.playSound();
          }
          this.displayedColor = color;
        }),
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get backgroundColor(): string {
    switch (this.color) {
      case Color.BLUE:
        return '#0680e0';
      case Color.RED:
        return '#e43b2e';
      case Color.GREEN:
        return '#4caf50';
      case Color.YELLOW:
        return '#f7f730';
    }
  }

  get active(): boolean {
    return this.color === this.displayedColor;
  }

  @HostBinding('class.enabled')
  get enabled(): boolean {
    return this.isOn && !this.hasWon && this.displayedColor === null;
  }

  onClick(): void {
    if (this.enabled) {
      if (document.activeElement && (document.activeElement as HTMLElement).blur) {
        (document.activeElement as HTMLElement).blur();
      }
      this.playSound();
      this.gameService.guess(this.color);
    }
  }

  private playSound(): void {
    this.soundService.play(this.color);
  }
}
