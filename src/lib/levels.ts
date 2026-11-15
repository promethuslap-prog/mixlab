export function dbToGain(db: number): number {
  if (db <= -60) return 0;
  return 10 ** (db / 20);
}

export function formatDb(db: number, digits = 1): string {
  if (db <= -48) return '−∞';
  const rounded = Number(db.toFixed(digits));
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded.toFixed(digits)}`;
}

export function formatPan(pan: number): string {
  if (Math.abs(pan) < 0.03) return 'C';
  const amount = Math.round(Math.abs(pan) * 100);
  return pan < 0 ? `L ${amount}` : `R ${amount}`;
}

export function formatEq(db: number): string {
  if (Math.abs(db) < 0.35) return '0';
  const rounded = Math.round(db);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatHz(hz: number): string {
  if (hz >= 1000) {
    const k = hz / 1000;
    const text = k >= 10 ? k.toFixed(1) : k.toFixed(k >= 2 ? 1 : 2);
    return `${text.replace(/\.0$/, '')} kHz`;
  }
  return `${Math.round(hz)} Hz`;
}

const FADER_MIN = -48;
const FADER_MAX = 6;
const UNITY = 0.78;

export function positionToDb(position: number): number {
  const p = Math.min(1, Math.max(0, position));
  if (p <= 0.015) return -60;
  if (p < UNITY) {
    const t = (p - 0.015) / (UNITY - 0.015);
    return FADER_MIN + t * (0 - FADER_MIN);
  }
  const t = (p - UNITY) / (1 - UNITY);
  return t * FADER_MAX;
}

export function dbToPosition(db: number): number {
  if (db <= -60) return 0;
  if (db < 0) {
    const clamped = Math.max(FADER_MIN, db);
    const t = (clamped - FADER_MIN) / (0 - FADER_MIN);
    return 0.015 + t * (UNITY - 0.015);
  }
  const t = Math.min(1, db / FADER_MAX);
  return UNITY + t * (1 - UNITY);
}

export function positionToHz(position: number): number {
  const p = Math.min(1, Math.max(0, position));
  const min = Math.log(20);
  const max = Math.log(20000);
  return Math.exp(min + p * (max - min));
}

export function hzToPosition(hz: number): number {
  const clamped = Math.min(20000, Math.max(20, hz));
  return (Math.log(clamped) - Math.log(20)) / (Math.log(20000) - Math.log(20));
}
