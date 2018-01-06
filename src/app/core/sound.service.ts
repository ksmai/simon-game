import { Injectable } from '@angular/core';
import { Color } from '../../models/color';

export const SOUND_MAP = {
  [Color.BLUE]: require('../../../assets/sound_blue.mp3'),
  [Color.RED]: require('../../../assets/sound_red.mp3'),
  [Color.YELLOW]: require('../../../assets/sound_yellow.mp3'),
  [Color.GREEN]: require('../../../assets/sound_green.mp3'),
};

@Injectable()
export class SoundService {
  play(color: Color): void {
    const path = SOUND_MAP[color];
    if (path) {
      const audio = new Audio(path);
      audio.play();
    }
  }
}
