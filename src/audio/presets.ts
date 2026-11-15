import { CHANNEL_IDS, type ChannelMix, type MixGraphState } from '@/audio/types';

export type PresetId = 'good' | 'problem' | 'flat';

function channel(partial: Partial<ChannelMix> = {}): ChannelMix {
  return {
    gainDb: 0,
    pan: 0,
    low: 0,
    mid: 0,
    high: 0,
    mute: false,
    solo: false,
    ...partial,
  };
}

export const PRESETS: Record<PresetId, MixGraphState> = {
  good: {
    masterDb: -8,
    channels: {
      vocal: channel({ gainDb: 0, low: -2, mid: 1.5, high: 1 }),
      guitar: channel({ gainDb: -8, pan: -0.45, low: -3, mid: 1, high: -1 }),
      keys: channel({ gainDb: -10, pan: 0.5, low: -2, mid: 0, high: 0 }),
      kick: channel({ gainDb: -5, low: 1, mid: -2, high: -4 }),
      snare: channel({ gainDb: -6, pan: 0.04, low: -5, mid: 1, high: 1 }),
      bass: channel({ gainDb: -6, low: 1, mid: -1, high: -6 }),
    },
  },
  problem: {
    masterDb: 1,
    channels: {
      vocal: channel({ gainDb: -16, mid: -2, high: 2 }),
      guitar: channel({ gainDb: -1, pan: -0.85, low: 2, mid: 3, high: 8 }),
      keys: channel({ gainDb: -2, pan: -0.72, low: 1, high: 4 }),
      kick: channel({ gainDb: 2, low: 8, mid: 2 }),
      snare: channel({ gainDb: -2, high: 7 }),
      bass: channel({ gainDb: 2, low: 8, high: -2 }),
    },
  },
  flat: {
    masterDb: -6,
    channels: {
      vocal: channel(),
      guitar: channel(),
      keys: channel(),
      kick: channel(),
      snare: channel(),
      bass: channel(),
    },
  },
};

export const PRESET_META: { id: PresetId; label: string; detail: string }[] = [
  { id: 'good', label: 'Starting point', detail: 'A balanced static mix' },
  { id: 'problem', label: 'Fix this mix', detail: 'Find what is wrong' },
  { id: 'flat', label: 'Flat', detail: 'Unity, no EQ, centered' },
];

export function cloneMix(state: MixGraphState): MixGraphState {
  return {
    masterDb: state.masterDb,
    channels: CHANNEL_IDS.reduce(
      (acc, id) => {
        acc[id] = { ...state.channels[id] };
        return acc;
      },
      {} as MixGraphState['channels'],
    ),
  };
}

export function mixesMatch(a: MixGraphState, b: MixGraphState): boolean {
  if (Math.abs(a.masterDb - b.masterDb) > 0.05) return false;
  return CHANNEL_IDS.every((id) => {
    const left = a.channels[id];
    const right = b.channels[id];
    return (
      Math.abs(left.gainDb - right.gainDb) < 0.05 &&
      Math.abs(left.pan - right.pan) < 0.02 &&
      Math.abs(left.low - right.low) < 0.2 &&
      Math.abs(left.mid - right.mid) < 0.2 &&
      Math.abs(left.high - right.high) < 0.2 &&
      left.mute === right.mute &&
      left.solo === right.solo
    );
  });
}
