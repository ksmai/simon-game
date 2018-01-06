import { SoundService, SOUND_MAP } from './sound.service';
import { Color } from '../../models/color';

describe('SoundService', () => {
  let soundService: SoundService;
  let spies: { [key: string]: { [key: number]: jasmine.Spy } }; ;
  const resetSpies = () => {
    for (const key in spies) {
      for (const color in spies[key]) {
        spies[key][color].calls.reset();
      }
    }
  };

  beforeEach(() => {
    soundService = new SoundService();
    spies = {
      play: {
        [Color.BLUE]: spyOn(SOUND_MAP[Color.BLUE], 'play'),
        [Color.RED]: spyOn(SOUND_MAP[Color.RED], 'play'),
        [Color.GREEN]: spyOn(SOUND_MAP[Color.GREEN], 'play'),
        [Color.YELLOW]: spyOn(SOUND_MAP[Color.YELLOW], 'play'),
      },
      pause: {
        [Color.BLUE]: spyOn(SOUND_MAP[Color.BLUE], 'pause'),
        [Color.RED]: spyOn(SOUND_MAP[Color.RED], 'pause'),
        [Color.GREEN]: spyOn(SOUND_MAP[Color.GREEN], 'pause'),
        [Color.YELLOW]: spyOn(SOUND_MAP[Color.YELLOW], 'pause'),
      },
    };
    resetSpies();
  });

  it('should play the audio', () => {
    const colors = [Color.BLUE, Color.RED, Color.GREEN, Color.YELLOW];
    for (let color of colors) {
      soundService.play(color);
      expect(spies['play'][color]).toHaveBeenCalledWith();
      resetSpies();
    }
  });

  it('should pause previous audio', () => {
    expect(spies.pause[Color.BLUE]).not.toHaveBeenCalled();
    expect(spies.play[Color.BLUE]).not.toHaveBeenCalled();
    soundService.play(Color.BLUE);
    expect(spies.pause[Color.BLUE]).not.toHaveBeenCalled();
    expect(spies.play[Color.BLUE]).toHaveBeenCalled();
    soundService.play(Color.BLUE);
    expect(spies.pause[Color.BLUE]).toHaveBeenCalled();
    expect(spies.play[Color.BLUE]).toHaveBeenCalled();
  });
});
