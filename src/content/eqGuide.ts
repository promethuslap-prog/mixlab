export type EqInfo = {
  id: string;
  title: string;
  range: string;
  hear: string;
  problems: string;
  fixes: string;
  instruments: string;
};

const BANDS: { below: number; info: EqInfo }[] = [
  {
    below: 60,
    info: {
      id: 'sub',
      title: 'Sub',
      range: '20–60 Hz',
      hear: 'More of a feeling than a pitch. Rumble, thump, and the lowest note of a bass.',
      problems: 'Too much eats headroom, rattles the room, and makes everything muddy. Too little and a track can feel small, but most sources should not live here.',
      fixes: 'High-pass almost everything except kick and bass. If the kick is boomy, a narrow cut often works better than turning the whole low end down.',
      instruments: 'Kick drum, bass guitar, synth sub, floor tom.',
    },
  },
  {
    below: 120,
    info: {
      id: 'bass',
      title: 'Bass',
      range: '60–120 Hz',
      hear: 'The note of the bass and the body of the kick. This is the weight of the song.',
      problems: 'Too much sounds boomy and covers the vocal. Too little sounds thin, especially on a system with real speakers.',
      fixes: 'Let kick or bass own this zone, not both at full volume. A small cut on one of them usually clears it up.',
      instruments: 'Bass guitar, kick, low toms, the chest of a low voice.',
    },
  },
  {
    below: 250,
    info: {
      id: 'warmth',
      title: 'Warmth',
      range: '120–250 Hz',
      hear: 'Fullness and body. Guitars feel bigger here. Vocals feel warmer.',
      problems: 'Too much gets woolly. The mix sounds crowded even when the faders are not that loud.',
      fixes: 'Small cuts on rhythm guitar, piano, and extra mics. Leave the warmth on the one instrument that should feel big.',
      instruments: 'Guitar body, toms, piano left hand, vocal fundamentals.',
    },
  },
  {
    below: 500,
    info: {
      id: 'mud',
      title: 'Mud and box',
      range: '250–500 Hz',
      hear: 'The cardboard, boxy zone. A lot of "this mix sounds cheap" lives here.',
      problems: 'Too much sounds like a speaker in a closet. Rooms add this on their own, so live mixes collect it fast.',
      fixes: 'A wide, gentle cut on guitars, pianos, and overheads. Do not scoop it off the vocal unless it really honks.',
      instruments: 'Acoustic guitar body, snare shell, room sound, piano.',
    },
  },
  {
    below: 1000,
    info: {
      id: 'honk',
      title: 'Low mids',
      range: '500 Hz–1 kHz',
      hear: 'Honk, nasal tone, and the "aw" of a voice. Instruments start to poke out here.',
      problems: 'A narrow peak can make a snare ring or a guitar quack. A dip can make a source sound hollow.',
      fixes: 'Sweep a narrow boost until the ugly note jumps out, then cut that spot a few dB. That is a search, not a smile curve.',
      instruments: 'Vocals, snare ring, electric guitar, horns.',
    },
  },
  {
    below: 2000,
    info: {
      id: 'mids',
      title: 'Mids',
      range: '1–2 kHz',
      hear: 'The forward, in-your-face band. A lot of instrument attack starts here.',
      problems: 'Too much is fatiguing even when the very top does not sound bright. Too little and the band feels distant.',
      fixes: 'If a mix is harsh but the treble knob is not the problem, look here before you touch the highs.',
      instruments: 'Vocals, snare crack, guitar bite, piano attack.',
    },
  },
  {
    below: 4000,
    info: {
      id: 'presence',
      title: 'Presence',
      range: '2–4 kHz',
      hear: 'Consonants, intelligibility, and edge. Ears are especially sensitive here.',
      problems: 'Too much hurts and makes people turn the system down. Too little and the vocal mumbles even if the fader is up.',
      fixes: 'A small boost on the vocal, and a small cut in the same spot on the guitar that is masking it. Do not boost both.',
      instruments: 'Lead vocal, distorted guitar, snare, cymbal attack.',
    },
  },
  {
    below: 8000,
    info: {
      id: 'clarity',
      title: 'Clarity',
      range: '4–8 kHz',
      hear: 'Detail, pick noise, cymbal stick, and "s" sounds.',
      problems: 'Too much is hissy and essy. Sibilance, the harsh "s" and "t" in a vocal, usually sits around 5–8 kHz.',
      fixes: 'A de-esser or a narrow cut on the vocal. Do not dull the whole mix just to hide one "s".',
      instruments: 'Vocal sibilance, cymbals, acoustic guitar pick, hi-hat.',
    },
  },
  {
    below: 12000,
    info: {
      id: 'bright',
      title: 'Brightness',
      range: '8–12 kHz',
      hear: 'Shimmer and open top end. Cymbals and breath live here more than pitch does.',
      problems: 'Too much is brittle. Cheap speakers exaggerate it. Too little can sound dull or covered.',
      fixes: 'A gentle high shelf, one or two dB, is plenty. If you need more than that, the mids are probably the real problem.',
      instruments: 'Cymbals, vocal breath, room air, acoustic guitar.',
    },
  },
  {
    below: 20001,
    info: {
      id: 'air',
      title: 'Air',
      range: '12–20 kHz',
      hear: 'Sheen more than notes. Many adults barely hear the top of this band. Teens often still do.',
      problems: 'Cranking it mostly adds hiss and harshness. It will not fix a vocal that is buried in the mids.',
      fixes: 'Use a light shelf if a mix sounds closed. Keep the boost small, and check it quiet, because loud playback hides the pain.',
      instruments: 'Cymbal wash, vocal air, reverb tails, ribbon or condenser "sparkle".',
    },
  },
];

export function describeFrequency(hz: number): EqInfo {
  const band = BANDS.find((item) => hz < item.below) ?? BANDS[BANDS.length - 1];
  return band.info;
}

export const EQ_BANDS = BANDS.map((item) => item.info);
