import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './button/button.component';
import { ControllerComponent } from './controller/controller.component';

@NgModule({
  imports: [
    SharedModule,
  ],

  declarations: [
    ButtonComponent,
    ControllerComponent,
  ],

  exports: [
    ButtonComponent,
    ControllerComponent,
  ],
})
export class GameModule {
}
