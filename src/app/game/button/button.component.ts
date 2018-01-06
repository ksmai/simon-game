import { Component, Input } from '@angular/core';

import { Color } from '../../../models/color';
import { GameService } from '../../core/game.service';
import { SoundService } from '../../core/sound.service';

@Component({
  selector: 'simon-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() color: Color;

  constructor(
    private gameService: GameService,
    private soundService: SoundService,
  ) {
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

  onClick(): void {
    this.soundService.play(this.color);
  }
}
