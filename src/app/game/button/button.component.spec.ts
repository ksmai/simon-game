import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Color } from '../../../models/color';
import { ButtonComponent } from './button.component';
import { GameService } from '../../core/game.service';
import { SoundService } from '../../core/sound.service';

let page: Page;
let fixture: ComponentFixture<ButtonComponent>;
let component: ButtonComponent;
let isOnSubject: Subject<boolean>;
let hasWonSubject: Subject<boolean>;
let displayedColorSubject: Subject<Color|null>;
let fakeGameService: GameService;
let fakeSoundService: SoundService;

function createButtonComponent() {
  fixture = TestBed.createComponent(ButtonComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

class Page {
  button: DebugElement;
  gameService: GameService;
  soundService: SoundService;

  createElements() {
    this.button = fixture.debugElement.query(By.css('.button'));
    this.gameService = fixture.debugElement.injector.get(GameService);
    this.soundService = fixture.debugElement.injector.get(SoundService);
  }
}

describe('ButtonComponent', () => {
  beforeEach(() => {
    isOnSubject = new Subject<boolean>();
    hasWonSubject = new Subject<boolean>();
    displayedColorSubject = new Subject<Color|null>();
    fakeGameService = {
      getIsOn: jasmine.createSpy('getIsOn')
        .and.returnValue(isOnSubject.asObservable()),
      getHasWon: jasmine.createSpy('getHasWon')
        .and.returnValue(hasWonSubject.asObservable()),
      getDisplayedColor: jasmine.createSpy('getDisplayedColor')
        .and.returnValue(displayedColorSubject.asObservable()),
    } as any as GameService;
    fakeSoundService = { play: jasmine.createSpy('stub') } as any as SoundService;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      providers: [
        { provide: GameService, useValue: fakeGameService },
        { provide: SoundService, useValue: fakeSoundService },
      ],
    }).compileComponents();
  }));

  beforeEach(createButtonComponent);

  it('should subscribe to game service', () => {
    expect(page.gameService.getIsOn).toHaveBeenCalled();
    expect(page.gameService.getHasWon).toHaveBeenCalled();
    expect(page.gameService.getDisplayedColor).toHaveBeenCalled();
  });

  it('should enable the buttton when it is the user\'s turn', () => {
    isOnSubject.next(true);
    hasWonSubject.next(false);
    displayedColorSubject.next(null);
    fixture.detectChanges();
    expect(component.enabled).toBe(true);
    expect(fixture.debugElement.nativeElement.classList.contains('enabled')).toBe(true);
  });

  it('should not enable button if the game controller is not on', () => {
    isOnSubject.next(false);
    hasWonSubject.next(false);
    displayedColorSubject.next(null);
    fixture.detectChanges();
    expect(component.enabled).toBe(false);
    expect(fixture.debugElement.nativeElement.classList.contains('enabled')).toBe(false);
  });

  it('should not enable button if the game has been won', () => {
    isOnSubject.next(true);
    hasWonSubject.next(true);
    displayedColorSubject.next(null);
    fixture.detectChanges();
    expect(component.enabled).toBe(false);
    expect(fixture.debugElement.nativeElement.classList.contains('enabled')).toBe(false);
  });

  it('should not enable button if currently displaying some colors', () => {
    isOnSubject.next(true);
    hasWonSubject.next(false);
    displayedColorSubject.next(Color.BLUE);
    fixture.detectChanges();
    expect(component.enabled).toBe(false);
    expect(fixture.debugElement.nativeElement.classList.contains('enabled')).toBe(false);
  });

  it('should become active iff currently displaying own color', () => {
    component.color = Color.RED;
    displayedColorSubject.next(Color.RED);
    fixture.detectChanges();
    expect(component.active).toBe(true);
    expect(page.button.nativeElement.classList.contains('button--active'))
      .toBe(true);

    displayedColorSubject.next(Color.BLUE);
    fixture.detectChanges();
    expect(component.active).toBe(false);
    expect(page.button.nativeElement.classList.contains('button--active'))
      .toBe(false);
  });

  it('should show different background colors for different color values', () => {
    component.color = Color.BLUE;
    fixture.detectChanges();
    const blueColor = component.backgroundColor;
    const bgBlue = page.button.nativeElement.style.backgroundColor;
    expect(rgbToHex(bgBlue)).toEqual(blueColor);
    component.color = Color.RED;
    fixture.detectChanges();
    const redColor = component.backgroundColor;
    const bgRed = page.button.nativeElement.style.backgroundColor;
    expect(redColor).not.toEqual(blueColor);
    expect(rgbToHex(bgRed)).toEqual(redColor);
  });
});

function rgbToHex(rgb: string): string {
  const matches = rgb.match(/\d+/g);
  if (matches && matches.length === 3) {
    return '#' + matches.map(e => `0${(+e).toString(16)}`.slice(-2)).join('');
  }
  return rgb;
}
