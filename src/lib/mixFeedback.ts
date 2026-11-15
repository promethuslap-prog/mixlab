import { CHANNEL_IDS, type ChannelId, type ChannelMix, type MixGraphState } from '@/audio/types';
import { dbToGain } from '@/lib/levels';

export type MixNote = {
  id: string;
  tone: 'bad' | 'warn' | 'good' | 'info';
  title: string;
  body: string;
};

function anySolo(state: MixGraphState): boolean {
  return CHANNEL_IDS.some((id) => state.channels[id].solo);
}

function isLive(state: MixGraphState, id: ChannelId): boolean {
  const channel = state.channels[id];
  if (channel.mute) return false;
  if (anySolo(state) && !channel.solo) return false;
  return channel.gainDb > -45;
}

function liveChannels(state: MixGraphState): ChannelMix[] {
  return CHANNEL_IDS.filter((id) => isLive(state, id)).map((id) => state.channels[id]);
}

/** A rough peak guess used before the meter has spoken, and when playback is stopped. */
export function likelyClipping(state: MixGraphState): boolean {
  let sum = 0;
  for (const id of CHANNEL_IDS) {
    const channel = state.channels[id];
    if (!isLive(state, id)) continue;
    const lowBoost = 10 ** (Math.max(0, channel.low) / 20);
    sum += dbToGain(channel.gainDb) * 0.5 * Math.min(lowBoost, 2.5);
  }
  const peak = sum * 0.55 * dbToGain(state.masterDb);
  return peak > 0.98;
}

export function analyzeMix(state: MixGraphState, clipping: boolean): MixNote[] {
  const notes: { priority: number; note: MixNote }[] = [];
  const soloed = anySolo(state);
  const live = liveChannels(state);

  if (live.length === 0) {
    notes.push({
      priority: 110,
      note: {
        id: 'silent',
        tone: 'warn',
        title: 'Nothing is coming through',
        body: soloed
          ? 'Solo is on, but every soloed channel is muted or pulled all the way down.'
          : 'Every channel is muted or the faders are at the bottom. Unmute something and bring a fader up.',
      },
    });
  }

  if (soloed && live.length > 0) {
    notes.push({
      priority: 90,
      note: {
        id: 'solo',
        tone: 'info',
        title: 'Solo is on',
        body: 'You are hearing only the soloed channels. Clear solo when you want to judge the whole mix.',
      },
    });
  }

  if (clipping) {
    notes.push({
      priority: 100,
      note: {
        id: 'clip',
        tone: 'bad',
        title: 'The master is clipping',
        body: 'The mix is hitting the ceiling. Pull the master down until the meter stops flashing, then trim the loudest channels. Clipping is distortion, not loudness.',
      },
    });
  }

  const vocal = state.channels.vocal;
  const bandUp =
    ['guitar', 'keys', 'kick', 'bass']
      .filter((id) => isLive(state, id as ChannelId))
      .filter((id) => state.channels[id as ChannelId].gainDb >= -6).length >= 2;

  if (!vocal.mute && isLive(state, 'vocal') && vocal.gainDb <= -12 && bandUp) {
    notes.push({
      priority: 80,
      note: {
        id: 'buried',
        tone: 'warn',
        title: 'The vocal is buried',
        body: 'The instruments are much louder than the lead. Raise the vocal, or pull the band down, so the words sit in front.',
      },
    });
  }

  if (vocal.mute && live.length > 0 && !soloed) {
    notes.push({
      priority: 78,
      note: {
        id: 'vocal-muted',
        tone: 'warn',
        title: 'The vocal is muted',
        body: 'You cannot judge the mix of a song if the lead is off. Unmute it, then set the balance.',
      },
    });
  }

  const kick = state.channels.kick;
  const bass = state.channels.bass;
  const lowsHot =
    isLive(state, 'kick') &&
    isLive(state, 'bass') &&
    kick.gainDb >= -6 &&
    bass.gainDb >= -6 &&
    (kick.low >= 5 || bass.low >= 5) &&
    kick.low + bass.low >= 8;

  if (lowsHot) {
    notes.push({
      priority: 70,
      note: {
        id: 'lows',
        tone: 'warn',
        title: 'Too much low end',
        body: 'Kick and bass are both loud and both boosted in the lows. Ease one low knob, or drop one fader, so the bottom is not a blur. Kick and bass have to share that space.',
      },
    });
  }

  const harshChannel = (['vocal', 'guitar', 'snare'] as const).find(
    (id) => isLive(state, id) && state.channels[id].high >= 6,
  );
  if (harshChannel) {
    notes.push({
      priority: 65,
      note: {
        id: 'harsh',
        tone: 'warn',
        title: 'This is getting harsh',
        body: 'The high knob on the vocal, guitar, or snare is cranked. That range tires ears fast. Back the high band off until the edge is still there but it does not sting.',
      },
    });
  }

  const foundationOff = (['kick', 'snare', 'bass', 'vocal'] as const).some(
    (id) => isLive(state, id) && Math.abs(state.channels[id].pan) >= 0.35,
  );
  if (foundationOff) {
    notes.push({
      priority: 60,
      note: {
        id: 'foundation-pan',
        tone: 'warn',
        title: 'The core of the mix is off to one side',
        body: 'Keep kick, snare, bass, and the lead vocal near the center. If they are hard-panned, one side of the room loses the song.',
      },
    });
  }

  const guitar = state.channels.guitar;
  const keys = state.channels.keys;
  const sameSide =
    isLive(state, 'guitar') &&
    isLive(state, 'keys') &&
    Math.abs(guitar.pan) >= 0.45 &&
    Math.abs(keys.pan) >= 0.45 &&
    Math.sign(guitar.pan) === Math.sign(keys.pan);

  if (sameSide) {
    notes.push({
      priority: 55,
      note: {
        id: 'lopsided',
        tone: 'warn',
        title: 'The pan is lopsided',
        body: 'Guitar and keys are piled on the same side. Pan them to opposite sides so the picture is not stuck in one speaker.',
      },
    });
  }

  if (
    isLive(state, 'vocal') &&
    isLive(state, 'guitar') &&
    isLive(state, 'kick') &&
    vocal.gainDb >= 3 &&
    vocal.gainDb - guitar.gainDb >= 10 &&
    vocal.gainDb - kick.gainDb >= 8
  ) {
    notes.push({
      priority: 45,
      note: {
        id: 'vocal-hot',
        tone: 'warn',
        title: 'The vocal is way out front',
        body: 'It should lead, but not feel pasted on. Ease the vocal a few dB, or lift the band so they feel like one song.',
      },
    });
  }

  const eqFlat = CHANNEL_IDS.every((id) => {
    const channel = state.channels[id];
    return Math.abs(channel.low) < 1.5 && Math.abs(channel.mid) < 1.5 && Math.abs(channel.high) < 1.5;
  });
  const stacked =
    eqFlat &&
    isLive(state, 'vocal') &&
    isLive(state, 'guitar') &&
    isLive(state, 'keys') &&
    Math.abs(guitar.pan) < 0.12 &&
    Math.abs(keys.pan) < 0.12 &&
    Math.abs(vocal.gainDb - guitar.gainDb) < 4 &&
    Math.abs(vocal.gainDb - kick.gainDb) < 4;

  if (stacked) {
    notes.push({
      priority: 40,
      note: {
        id: 'flat',
        tone: 'info',
        title: 'This is still a flat stack',
        body: 'Everything is near the same level and parked in the center. Make the vocal a little louder than the band, and pan guitar and keys apart. That is a static mix.',
      },
    });
  }

  const opposite =
    guitar.pan * keys.pan < 0 &&
    Math.abs(guitar.pan) >= 0.2 &&
    Math.abs(guitar.pan) <= 0.7 &&
    Math.abs(keys.pan) >= 0.2 &&
    Math.abs(keys.pan) <= 0.7;
  const highsCalm = (['vocal', 'guitar', 'snare'] as const).every((id) => state.channels[id].high <= 4);
  const foundationCentered = (['kick', 'snare', 'bass', 'vocal'] as const).every(
    (id) => Math.abs(state.channels[id].pan) <= 0.18,
  );
  const vocalLeads =
    isLive(state, 'vocal') &&
    vocal.gainDb >= -4 &&
    vocal.gainDb <= 3 &&
    vocal.gainDb >= guitar.gainDb + 3 &&
    vocal.gainDb >= keys.gainDb + 3;
  const lowsSane =
    kick.gainDb >= -12 &&
    kick.gainDb <= 1 &&
    bass.gainDb >= -12 &&
    bass.gainDb <= 1 &&
    kick.low <= 4 &&
    bass.low <= 4 &&
    kick.low >= -4 &&
    bass.low >= -4;

  if (
    !clipping &&
    !soloed &&
    vocalLeads &&
    lowsSane &&
    highsCalm &&
    foundationCentered &&
    opposite &&
    state.masterDb <= -3 &&
    live.length === CHANNEL_IDS.length
  ) {
    notes.push({
      priority: 10,
      note: {
        id: 'good',
        tone: 'good',
        title: 'Solid starting mix',
        body: 'The vocal sits forward, the lows are under control, and the pan is not stuck on one side. Keep listening on headphones. Small moves from here, not big ones.',
      },
    });
  }

  if (notes.length === 0) {
    notes.push({
      priority: 0,
      note: {
        id: 'listen',
        tone: 'info',
        title: 'Keep listening',
        body: 'Can you hear the words? Is the low end tight or boomy? Does it feel even on the left and the right? Change one thing, then listen again.',
      },
    });
  }

  notes.sort((a, b) => b.priority - a.priority);
  const top = notes.slice(0, 2).map((item) => item.note);
  if (top[0]?.id === 'good') return [top[0]];
  return top;
}
