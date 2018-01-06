import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import '../styles/main.scss';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,

    CoreModule,
    SharedModule,
    GameModule,
  ],

  declarations: [
    AppComponent,
  ],

  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
