import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ButtonComponent } from './game/button/button.component';
import { ControllerComponent } from './game/controller/controller.component';

let fixture: ComponentFixture<AppComponent>;
let page: Page;

function createAppComponent() {
  fixture = TestBed.createComponent(AppComponent);
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

class Page {
  buttons: DebugElement[];
  controllers: DebugElement[];

  createElements(): void {
    this.buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
    this.controllers = fixture.debugElement.queryAll(By.directive(ControllerComponent));
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  }));

  beforeEach(createAppComponent);

  it('should contain 4 buttons', () => {
    expect(page.buttons.length).toBe(4);
  });

  it('should contain 1 controller', () => {
    expect(page.controllers.length).toBe(1);
  });
});
