import { NgModule, Optional, SkipSelf } from '@angular/core';

import { GameService } from './game.service';
import { SoundService } from './sound.service';

@NgModule({
  providers: [
    SoundService,
    GameService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() coreModule: CoreModule) {
    if (coreModule) {
      throw new Error('CoreModule should only be imported in AppModule');
    }
  }
}
