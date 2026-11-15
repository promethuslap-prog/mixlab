export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  mono: 'IBMPlexMono_500Medium',
} as const;

export type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  muted: string;
  faint: string;
  border: string;
  accent: string;
  accentPressed: string;
  accentSoft: string;
  onAccent: string;
  good: string;
  goodSoft: string;
  warn: string;
  warnSoft: string;
  danger: string;
  dangerSoft: string;
  infoSoft: string;
  meterTrack: string;
  faderTrack: string;
  tabBar: string;
  overlay: string;
  thumb: string;
};

export const dark: Palette = {
  bg: '#0C0E13',
  surface: '#171B24',
  surface2: '#222836',
  text: '#F4F6FB',
  muted: '#A3ADBE',
  faint: '#6E788A',
  border: 'rgba(255,255,255,0.08)',
  accent: '#7C6CFF',
  accentPressed: '#6858F0',
  accentSoft: 'rgba(124,108,255,0.18)',
  onAccent: '#FFFFFF',
  good: '#3DDC97',
  goodSoft: 'rgba(61,220,151,0.14)',
  warn: '#FFC14D',
  warnSoft: 'rgba(255,193,77,0.14)',
  danger: '#FF5C7A',
  dangerSoft: 'rgba(255,92,122,0.16)',
  infoSoft: 'rgba(124,108,255,0.14)',
  meterTrack: '#12151C',
  faderTrack: '#2C3344',
  tabBar: '#0C0E13',
  overlay: 'rgba(6,8,12,0.72)',
  thumb: '#F7F8FC',
};

export const light: Palette = {
  bg: '#F3F5F9',
  surface: '#FFFFFF',
  surface2: '#E7EBF3',
  text: '#151922',
  muted: '#5C677A',
  faint: '#8B95A8',
  border: 'rgba(20,24,33,0.08)',
  accent: '#5B4FE0',
  accentPressed: '#4A3EC8',
  accentSoft: 'rgba(91,79,224,0.10)',
  onAccent: '#FFFFFF',
  good: '#0C8F62',
  goodSoft: 'rgba(12,143,98,0.12)',
  warn: '#9A6408',
  warnSoft: 'rgba(183,121,31,0.12)',
  danger: '#D0143C',
  dangerSoft: 'rgba(208,20,60,0.10)',
  infoSoft: 'rgba(91,79,224,0.08)',
  meterTrack: '#E1E6F0',
  faderTrack: '#D5DCE8',
  tabBar: '#FFFFFF',
  overlay: 'rgba(16,20,28,0.46)',
  thumb: '#FFFFFF',
};
