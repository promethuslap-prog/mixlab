import type { GlossaryTerm } from '@/content/types';

export const glossary: GlossaryTerm[] = [
  {
    id: 'gain',
    term: 'Gain',
    definition:
      'The input level control, usually on the preamp. It sets how strong the signal is before it hits the rest of the channel.',
    why: 'Set gain for a healthy peak. Use the fader, not the gain knob, to mix.',
  },
  {
    id: 'fader',
    term: 'Fader',
    definition: 'The slider that sets how loud a channel, a bus, or the master is in the mix.',
    why: 'Unity, often marked 0, means the fader is not adding or cutting level.',
  },
  {
    id: 'headroom',
    term: 'Headroom',
    definition: 'The space between your loudest peaks and the point where the system clips.',
    why: 'Channels add up. A mix with no headroom on the master will distort even if each channel looks fine.',
  },
  {
    id: 'clipping',
    term: 'Clipping',
    definition:
      'What happens when a signal hits the ceiling and the tops of the wave get cut flat. It sounds like crackle or harsh distortion.',
    why: 'In a DAW or digital mixer the ceiling is 0 dBFS. Once it is in the recording, you cannot EQ it out.',
  },
  {
    id: 'decibel',
    term: 'Decibel',
    aka: 'dB',
    definition:
      'A logarithmic way to compare two levels. +6 dB is about twice the amplitude. About +10 dB feels twice as loud.',
    why: 'Small dB moves matter. A 2 dB vocal ride is a real mix decision, not a tiny one.',
  },
  {
    id: 'dbfs',
    term: 'dBFS',
    aka: 'decibels full scale',
    definition: 'Decibels relative to full scale. 0 dBFS is the maximum a digital system can store.',
    why: 'Meters in a DAW are dBFS. Staying under 0 is not a suggestion.',
  },
  {
    id: 'lufs',
    term: 'LUFS',
    aka: 'loudness units full scale',
    definition:
      'A measurement of perceived loudness over time. Streaming services use integrated LUFS to turn songs up or down.',
    why: 'Many services aim near -14 LUFS. Apple Music is closer to -16. Smashing a limiter to win the loudness war usually loses.',
  },
  {
    id: 'preamp',
    term: 'Preamp',
    aka: 'microphone preamplifier',
    definition: 'The first amplifier in the chain. It lifts a mic or instrument to line level.',
    why: 'A clean preamp setting is the start of gain staging. Distortion here is in the rest of the path.',
  },
  {
    id: 'phantom',
    term: 'Phantom power',
    aka: '48V, +48',
    definition:
      'A DC voltage, usually 48 volts, sent down a mic cable to power condenser microphones and some active DI boxes.',
    why: 'Turn it on only where it is needed. A vintage ribbon mic can be damaged by phantom on a bad cable.',
  },
  {
    id: 'pad',
    term: 'Pad',
    definition: 'A switch that turns the input down, often by about 20 dB, before the preamp gain.',
    why: 'Use it when a keyboard, drum module, or loud mic clips even with the gain all the way down.',
  },
  {
    id: 'hpf',
    term: 'High-pass filter',
    aka: 'HPF, low cut',
    definition: 'A filter that cuts low frequencies and lets highs pass. The cutoff is the frequency where it starts working.',
    why: 'Vocals and guitars often get one around 80–100 Hz so kick and bass can own the bottom.',
  },
  {
    id: 'eq',
    term: 'EQ',
    aka: 'equalizer',
    definition: 'A set of volume controls for ranges of frequency. It changes tone, not just loudness.',
    why: 'Cut the thing that is in the way before you boost the thing you want to hear.',
  },
  {
    id: 'frequency',
    term: 'Frequency',
    aka: 'Hz, hertz',
    definition:
      'How fast a sound vibrates, in cycles per second. 20 Hz is a very low pitch. 20 kHz is the top of what young ears can hear.',
    why: 'Naming the range — bass, mud, presence, air — is the first step in EQ.',
  },
  {
    id: 'q',
    term: 'Q',
    aka: 'bandwidth',
    definition: 'How wide an EQ band is. High Q is narrow. Low Q is broad.',
    why: 'Use a high Q to notch one ring. Use a low Q when you are changing the overall tone.',
  },
  {
    id: 'shelf',
    term: 'Shelf filter',
    definition: 'An EQ that turns everything above a frequency (high shelf) or below it (low shelf) up or down.',
    why: 'The low and high knobs on a simple mixer are shelves. A little goes a long way.',
  },
  {
    id: 'compressor',
    term: 'Compressor',
    definition: 'A processor that turns the signal down once it passes a threshold, so the level stays more even.',
    why: 'It is for control. If you can obviously hear it pumping, you may have too much.',
  },
  {
    id: 'threshold',
    term: 'Threshold',
    definition: 'The level where a compressor or a gate starts to work.',
    why: 'A lower threshold catches more of the performance. Set it while the musician plays the loud and the quiet parts.',
  },
  {
    id: 'ratio',
    term: 'Ratio',
    definition:
      'How hard a compressor turns the signal down. 4:1 means 4 dB over the threshold comes out as about 1 dB over.',
    why: '2:1 is gentle. 4:1 is clear. 10:1 and up behaves like a limiter.',
  },
  {
    id: 'attack',
    term: 'Attack',
    definition: 'How quickly a compressor reacts after the signal crosses the threshold.',
    why: 'A slower attack lets the snap of a drum through. A fast attack catches it and can dull the hit.',
  },
  {
    id: 'release',
    term: 'Release',
    definition: 'How quickly a compressor lets go after the signal drops back down.',
    why: 'Too fast can pump with the beat. Too slow keeps the sound squashed after the loud note is gone.',
  },
  {
    id: 'makeup',
    term: 'Makeup gain',
    definition: 'Gain added after a compressor to bring the average level back up.',
    why: 'Without it, the compressed version is just quieter, and quieter always sounds worse in an A/B.',
  },
  {
    id: 'limiter',
    term: 'Limiter',
    definition: 'A compressor with a very high ratio that stops peaks from passing a ceiling.',
    why: 'On a master, a ceiling around -1 dB helps the file survive conversion to MP3 or AAC.',
  },
  {
    id: 'pan',
    term: 'Pan',
    aka: 'pan pot',
    definition: 'The control that places a sound left, center, or right.',
    why: 'Keep kick, snare, bass, and lead vocal near center. Spread guitars, keys, and percussion.',
  },
  {
    id: 'bus',
    term: 'Bus',
    aka: 'group, subgroup',
    definition: 'A path that sums several channels so you can control or process them together.',
    why: 'A drum bus lets you turn the whole kit down 1 dB without touching eight faders.',
  },
  {
    id: 'aux',
    term: 'Aux send',
    aka: 'auxiliary send',
    definition: 'A copy of a channel sent somewhere else, usually to monitors or to reverb and delay.',
    why: 'The send level is separate from the fader when the send is pre-fader.',
  },
  {
    id: 'prefader',
    term: 'Pre-fader',
    definition: 'A send taken before the channel fader, so fader moves do not change the send.',
    why: 'This is the normal setting for stage monitor wedges.',
  },
  {
    id: 'postfader',
    term: 'Post-fader',
    definition: 'A send taken after the channel fader, so the send follows the fader.',
    why: 'This is the normal setting for reverb and delay. Pull the vocal down and the effect comes down too.',
  },
  {
    id: 'insert',
    term: 'Insert',
    definition: 'A patch point that puts a processor in line on one channel, such as a compressor or a graphic EQ.',
    why: 'An insert affects only that channel. A send shares one effect across many channels.',
  },
  {
    id: 'reverb',
    term: 'Reverb',
    definition: 'A wash of reflections that makes a sound feel like it is in a room, a hall, or a plate.',
    why: 'Too much pushes a vocal backward. High-pass the return so the low end does not turn to fog.',
  },
  {
    id: 'delay',
    term: 'Delay',
    definition:
      'A distinct repeat of a sound. Quarter-note delay time in milliseconds is 60,000 divided by the tempo in BPM.',
    why: 'At 120 BPM a quarter-note delay is 500 ms. A dotted eighth is 375 ms.',
  },
  {
    id: 'di',
    term: 'DI box',
    aka: 'direct box, direct inject',
    definition:
      'A box that turns an unbalanced instrument or line signal into a balanced mic-level signal for a long snake.',
    why: 'Use one for keyboards, piezo acoustic guitars, bass, and e-drum outputs. Passive needs no power. Active often wants phantom.',
  },
  {
    id: 'cardioid',
    term: 'Cardioid',
    definition: 'A microphone pickup pattern that hears the front and rejects the rear.',
    why: 'Point the back of a cardioid vocal mic toward the wedge to get more level before feedback.',
  },
  {
    id: 'proximity',
    term: 'Proximity effect',
    definition: 'The bass boost you get when a directional mic is very close to the source.',
    why: 'If a vocal is boomy, back the mic up a few centimeters before you reach for a low cut.',
  },
  {
    id: 'feedback',
    term: 'Feedback',
    definition: 'A loop where a microphone hears a speaker and one frequency howls louder each time around.',
    why: 'Turn the level down, then cut the ringing frequency. Do not smash the entire graphic EQ.',
  },
  {
    id: 'staging',
    term: 'Gain staging',
    definition: 'Setting the level at each stage so nothing is too quiet (noisy) or too hot (clipping).',
    why: 'Do it from the source forward: mic, preamp, channel, bus, master.',
  },
  {
    id: 'phase',
    term: 'Phase',
    definition:
      'The timing relationship between two waves. If two mics are out of phase, combining them can cancel the low end.',
    why: 'Overheads that are different distances from the snare, or a top and bottom snare mic, are classic cases.',
  },
  {
    id: 'polarity',
    term: 'Polarity',
    aka: 'ø, phase button',
    definition: 'A flip that turns the waveform upside down. It is a 180 degree inversion, not a time delay.',
    why: 'If two mics on one source sound thin together, flip polarity on one of them and keep the fuller setting.',
  },
  {
    id: 'transient',
    term: 'Transient',
    definition: 'The short, fast attack at the start of a sound, like a snare hit or a picked string.',
    why: 'A compressor with a slow attack leaves the transient. A fast attack shaves it off.',
  },
  {
    id: 'sibilance',
    term: 'Sibilance',
    definition: 'The harsh "s" and "t" sounds in a vocal, usually somewhere around 5–8 kHz.',
    why: 'A de-esser, or a narrow EQ cut, tames those letters without dulling the whole vocal.',
  },
  {
    id: 'gate',
    term: 'Noise gate',
    definition: 'A processor that turns a channel down or off when the signal falls below a threshold.',
    why: 'Useful on a tom mic so it is quiet between hits. Set too high, it chops the start of the note.',
  },
  {
    id: 'automation',
    term: 'Automation',
    definition: 'Fader, pan, or plugin moves that are recorded and play back with the song.',
    why: 'Ride a vocal that gets quiet in one line instead of compressing the whole performance harder.',
  },
  {
    id: 'reference',
    term: 'Reference track',
    definition: 'A finished song you compare your mix against, at the same loudness.',
    why: 'If yours only sounds better when it is louder, the balance is not actually better.',
  },
  {
    id: 'foh',
    term: 'FOH',
    aka: 'front of house',
    definition: 'The audience mix, and the place the main console usually sits.',
    why: 'FOH and the monitor mixes are separate. Do not treat them as one fader.',
  },
  {
    id: 'mono',
    term: 'Mono',
    definition: 'One channel. Stereo is two. Checking a mix in mono shows balance and phase problems.',
    why: 'Phones, some PA hangs, and some clubs sum to mono. If a part vanishes, fix the phase or the pan.',
  },
  {
    id: 'sample-rate',
    term: 'Sample rate',
    definition:
      'How many snapshots per second a digital system takes of a wave. 44.1 kHz and 48 kHz are the common ones.',
    why: '44.1 kHz is the usual music master. 48 kHz is the usual choice when the audio goes with video.',
  },
  {
    id: 'bit-depth',
    term: 'Bit depth',
    definition: 'How many bits describe each sample. 24-bit is a normal recording depth. 16-bit is a CD.',
    why: 'Dither when you reduce bit depth. You do not need to record hot just because the file is 24-bit.',
  },
];

export function searchGlossary(query: string): GlossaryTerm[] {
  const needle = query.trim().toLowerCase();
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  if (!needle) return sorted;
  return sorted.filter((term) => {
    const haystack = `${term.term} ${term.aka ?? ''} ${term.definition} ${term.why}`.toLowerCase();
    return haystack.includes(needle);
  });
}
