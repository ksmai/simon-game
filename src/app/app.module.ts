import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';
import '../styles/main.scss';

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
