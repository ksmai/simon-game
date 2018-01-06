import { SoundService, SOUND_MAP } from './sound.service';
import { Color } from '../../models/color';

describe('SoundService', () => {
  let audioSpy: jasmine.Spy;
  let audioStub: { play: jasmine.Spy };
  let soundService: SoundService;

  beforeEach(() => {
    audioStub = { play: jasmine.createSpy('play') };
    audioSpy = spyOn(window as any, 'Audio').and.returnValue(audioStub);
    soundService = new SoundService();
  });

  it('should create an audio and play for the given color', () => {
    const colors = [Color.BLUE, Color.RED, Color.GREEN, Color.YELLOW];
    for (let color of colors) {
      soundService.play(color);
      expect(audioSpy).toHaveBeenCalledWith(SOUND_MAP[color]);
      expect(audioStub.play).toHaveBeenCalled();
      audioSpy.calls.reset();
      audioStub.play.calls.reset();
    }
  });
});
