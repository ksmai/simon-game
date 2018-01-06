import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GameService } from '../../core/game.service';

@Component({
  selector: 'simon-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit {
  isOn$: Observable<boolean>;
  isStrictMode$: Observable<boolean>;
  score$: Observable<string>;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.isOn$ = this.gameService.getIsOn();
    this.isStrictMode$ = this.gameService.getIsStrictMode();
    this.score$ = this.gameService.getScore();
  }

  toggleOn(): void {
    this.gameService.toggleOn();
  }

  toggleStrict(): void {
    this.gameService.toggleStrictMode();
  }
}
