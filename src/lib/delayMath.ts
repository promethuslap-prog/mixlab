export type DelayTimes = {
  quarter: number;
  eighth: number;
  sixteenth: number;
  dottedEighth: number;
  quarterTriplet: number;
};

/** Quarter-note delay in milliseconds is 60,000 ÷ BPM. */
export function delayTimes(bpm: number): DelayTimes {
  const safe = Math.min(200, Math.max(40, bpm));
  const quarter = 60000 / safe;
  return {
    quarter,
    eighth: quarter / 2,
    sixteenth: quarter / 4,
    dottedEighth: quarter * 0.75,
    quarterTriplet: quarter * (2 / 3),
  };
}

export function formatMs(ms: number): string {
  return `${Math.round(ms)} ms`;
}
