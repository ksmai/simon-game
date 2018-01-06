import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Color } from '../../../models/color';
import { ControllerComponent } from './controller.component';
import { GameService } from '../../core/game.service';
import { SoundService } from '../../core/sound.service';

let page: Page;
let fixture: ComponentFixture<ControllerComponent>;
let component: ControllerComponent;
let isOnSubject: Subject<boolean>;
let isStrictModeSubject: Subject<boolean>;
let scoreSubject: Subject<string>;
let displayedColorSubject: Subject<Color|null>;
let fakeGameService: GameService;

function createControllerComponent() {
  fixture = TestBed.createComponent(ControllerComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

class Page {
  scoreDisplay: DebugElement;
  resetButton: DebugElement;
  strictButton: DebugElement;
  switchButton: DebugElement;
  gameService: GameService;

  createElements() {
    this.scoreDisplay = fixture.debugElement.query(By.css('.score__display'));
    this.resetButton = fixture.debugElement.query(By.css('.start__button'));
    this.strictButton = fixture.debugElement.query(By.css('.strict__button'));
    this.switchButton = fixture.debugElement.query(By.css('.switch__button'));
    this.gameService = fixture.debugElement.injector.get(GameService);
  }
}

describe('ControllerComponent', () => {
  beforeEach(() => {
    isOnSubject = new Subject<boolean>();
    isStrictModeSubject = new Subject<boolean>();
    scoreSubject = new Subject<string>();
    displayedColorSubject = new Subject<Color|null>();
    fakeGameService = {
      getIsOn: jasmine.createSpy('getIsOn')
        .and.returnValue(isOnSubject.asObservable()),
      getIsStrictMode: jasmine.createSpy('getIsStrictMode')
        .and.returnValue(isStrictModeSubject.asObservable()),
      getDisplayedColor: jasmine.createSpy('getDisplayedColor')
        .and.returnValue(displayedColorSubject.asObservable()),
      getScore: jasmine.createSpy('getScore')
        .and.returnValue(scoreSubject.asObservable()),
      toggleOn: jasmine.createSpy('toggleOn'),
      resetGame: jasmine.createSpy('resetGame'),
      toggleStrictMode: jasmine.createSpy('toggleStrictMode'),
    } as any as GameService;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControllerComponent],
      providers: [
        { provide: GameService, useValue: fakeGameService },
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    createControllerComponent()
      .then(() => {
        // allow reset by default
        displayedColorSubject.next(null);
        // turn on by default for displaying buttons
        isOnSubject.next(true);
        fixture.detectChanges();
        page.createElements();
      });
  }));

  it('should subscribe to game service', () => {
    expect(page.gameService.getIsOn).toHaveBeenCalled();
    expect(page.gameService.getIsStrictMode).toHaveBeenCalled();
    expect(page.gameService.getDisplayedColor).toHaveBeenCalled();
    expect(page.gameService.getScore).toHaveBeenCalled();
  });

  it('should allow reset if no displaying color', () => {
    displayedColorSubject.next(null);
    fixture.detectChanges();
    expect(component.canReset).toBe(true);
  });

  it('should not allow reset if displaying some colors', () => {
    displayedColorSubject.next(Color.BLUE);
    fixture.detectChanges();
    expect(component.canReset).toBe(false);
  });

  it('should display the score from game service', () => {
    const score = 'some scores';
    scoreSubject.next(score);
    fixture.detectChanges();
    expect(page.scoreDisplay.nativeElement.textContent).toEqual(score);
  });

  it('should toggleOn', () => {
    expect(page.gameService.toggleOn).not.toHaveBeenCalled();
    page.switchButton.triggerEventHandler('click', null);
    expect(page.gameService.toggleOn).toHaveBeenCalled();
  });

  it('should toggleStrict', () => {
    expect(page.gameService.toggleStrictMode).not.toHaveBeenCalled();
    page.strictButton.triggerEventHandler('click', null);
    expect(page.gameService.toggleStrictMode).toHaveBeenCalled();
  });

  it('should reset game', () => {
    expect(page.gameService.resetGame).not.toHaveBeenCalled();
    page.resetButton.triggerEventHandler('click', null);
    expect(page.gameService.resetGame).toHaveBeenCalled();
  });

  it('should hide buttons and score when switched off', () => {
    isOnSubject.next(false);
    fixture.detectChanges();
    page.createElements();
    expect(page.resetButton).toBeNull();
    expect(page.scoreDisplay).toBeNull();
    expect(page.strictButton).toBeNull();
  });
});
