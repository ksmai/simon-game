import { Injectable } from '@angular/core';
import { Color } from '../../models/color';

export const SOUND_MAP = {
  [Color.BLUE]: new Audio(require('../../../assets/sound_blue.mp3')),
  [Color.RED]: new Audio(require('../../../assets/sound_red.mp3')),
  [Color.YELLOW]: new Audio(require('../../../assets/sound_yellow.mp3')),
  [Color.GREEN]: new Audio(require('../../../assets/sound_green.mp3')),
};

@Injectable()
export class SoundService {
  private lastAudio: HTMLAudioElement;

  play(color: Color): void {
    if (this.lastAudio) {
      this.lastAudio.pause();
    }
    const audio = SOUND_MAP[color];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
    this.lastAudio = audio;
  }
}
