export const CHANNEL_IDS = ['vocal', 'guitar', 'keys', 'kick', 'snare', 'bass'] as const;

export type ChannelId = (typeof CHANNEL_IDS)[number];

export type ChannelMix = {
  gainDb: number;
  pan: number;
  low: number;
  mid: number;
  high: number;
  mute: boolean;
  solo: boolean;
};

export type MixGraphState = {
  masterDb: number;
  channels: Record<ChannelId, ChannelMix>;
};

export type MeterReading = {
  db: number;
  peak: number;
  clipping: boolean;
  rms?: number;
  state?: string;
};

export type EqListenMode = 'noise' | 'tone';

export const LOOP_INFO = {
  bpm: 96,
  key: 'A minor',
  bars: 4,
  lowHz: 120,
  midHz: 1000,
  highHz: 8000,
} as const;

export const CHANNELS: { id: ChannelId; name: string; hint: string; color: string }[] = [
  { id: 'vocal', name: 'Lead vocal', hint: 'Synth melody', color: '#FF4D8D' },
  { id: 'guitar', name: 'Guitar', hint: 'Muted chords', color: '#FF8A3D' },
  { id: 'keys', name: 'Keys', hint: 'Electric piano', color: '#8B6CFF' },
  { id: 'kick', name: 'Kick', hint: 'The pulse', color: '#2FCB8A' },
  { id: 'snare', name: 'Snare', hint: 'Backbeat + hat', color: '#E3B341' },
  { id: 'bass', name: 'Bass', hint: 'Low end', color: '#3EC1F0' },
];
