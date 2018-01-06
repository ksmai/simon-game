import { Component } from '@angular/core';

import { Color } from '../models/color';

@Component({
  selector: 'simon-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  colors = [Color.BLUE, Color.RED, Color.GREEN, Color.YELLOW];

  trackByColor(color: Color): Color {
    return color;
  }
}
