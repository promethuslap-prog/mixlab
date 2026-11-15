import { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

type SliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onSliding?: (active: boolean) => void;
  color: string;
  vertical?: boolean;
  accessibilityLabel: string;
  valueText: string;
  detent?: number;
  detentWindow?: number;
  height?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ValueSlider({
  value,
  min,
  max,
  onChange,
  onSliding,
  color,
  vertical = false,
  accessibilityLabel,
  valueText,
  detent,
  detentWindow = 0,
  height = 168,
}: SliderProps) {
  const { colors } = useTheme();
  const size = useRef(1);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onSlidingRef = useRef(onSliding);
  const bounds = useRef({ min, max, detent, detentWindow, vertical });
  const startValue = useRef(value);
  const startPage = useRef(0);
  const stuck = useRef(false);
  valueRef.current = value;
  onChangeRef.current = onChange;
  onSlidingRef.current = onSliding;
  bounds.current = { min, max, detent, detentWindow, vertical };

  const apply = (raw: number, release = false) => {
    const b = bounds.current;
    let next = clamp(raw, b.min, b.max);
    const window = b.detentWindow ?? 0;
    if (b.detent != null && Math.abs(next - b.detent) <= window) {
      if (release || stuck.current || Math.abs(next - b.detent) <= window * 0.65) next = b.detent;
      stuck.current = next === b.detent;
    } else {
      stuck.current = false;
    }
    onChangeRef.current(next);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        onSlidingRef.current?.(true);
        const b = bounds.current;
        const verticalNow = b.vertical;
        const loc = verticalNow ? event.nativeEvent.locationY : event.nativeEvent.locationX;
        const span = Math.max(1, size.current);
        const ratio = clamp(verticalNow ? 1 - loc / span : loc / span, 0, 1);
        const next = b.min + ratio * (b.max - b.min);
        startValue.current = next;
        startPage.current = verticalNow ? event.nativeEvent.pageY : event.nativeEvent.pageX;
        apply(next);
      },
      onPanResponderMove: (event) => {
        const b = bounds.current;
        const page = b.vertical ? event.nativeEvent.pageY : event.nativeEvent.pageX;
        const delta = page - startPage.current;
        const direction = b.vertical ? -1 : 1;
        const next = startValue.current + (direction * delta * (b.max - b.min)) / Math.max(1, size.current);
        apply(next);
      },
      onPanResponderRelease: () => {
        apply(valueRef.current, true);
        onSlidingRef.current?.(false);
      },
      onPanResponderTerminate: () => onSlidingRef.current?.(false),
    }),
  ).current;

  const ratio = (value - min) / (max - min || 1);
  const detentRatio = detent == null ? null : (detent - min) / (max - min || 1);

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: valueText }}
      onAccessibilityAction={(event) => {
        const step = (max - min) / 16;
        if (event.nativeEvent.actionName === 'increment') onChange(clamp(value + step, min, max));
        if (event.nativeEvent.actionName === 'decrement') onChange(clamp(value - step, min, max));
      }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onLayout={(event) => {
        size.current = vertical ? event.nativeEvent.layout.height : event.nativeEvent.layout.width;
      }}
      style={vertical ? [styles.vHit, { height }] : styles.hHit}
      {...pan.panHandlers}
    >
      <View
        style={[
          vertical ? styles.vTrack : styles.hTrack,
          { backgroundColor: colors.faderTrack },
        ]}
      />
      {detentRatio != null ? (
        <View
          style={
            vertical
              ? [styles.vTick, { bottom: `${detentRatio * 100}%`, backgroundColor: colors.faint }]
              : [styles.hTick, { left: `${detentRatio * 100}%`, backgroundColor: colors.faint }]
          }
        />
      ) : null}
      <View
        style={
          vertical
            ? [
                styles.vFill,
                { height: `${Math.max(0, Math.min(1, ratio)) * 100}%`, backgroundColor: color },
              ]
            : [
                styles.hFill,
                { width: `${Math.max(0, Math.min(1, ratio)) * 100}%`, backgroundColor: color },
              ]
        }
      />
      <View
        style={
          vertical
            ? [
                styles.vThumb,
                {
                  bottom: `${Math.max(0, Math.min(1, ratio)) * 100}%`,
                  backgroundColor: colors.thumb,
                  borderColor: color,
                },
              ]
            : [
                styles.hThumb,
                {
                  left: `${Math.max(0, Math.min(1, ratio)) * 100}%`,
                  backgroundColor: colors.thumb,
                  borderColor: color,
                },
              ]
        }
      />
    </View>
  );
}

export function Meter({ db, clipping }: { db: number; clipping: boolean }) {
  const { colors } = useTheme();
  const shown = useRef(db);
  const [draw, setDraw] = useState(db);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const target = db;
      if (target > shown.current) shown.current = target;
      else shown.current += (target - shown.current) * 0.22;
      setDraw(shown.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [db]);

  const segments = 22;
  const lit = Math.round(((Math.min(0, Math.max(-42, draw)) + 42) / 42) * segments);
  return (
    <View style={styles.meterRow} accessibilityLabel={clipping ? 'Master meter, clipping' : 'Master meter'}>
      <View style={styles.segments}>
        {Array.from({ length: segments }, (_, index) => {
          const on = index < lit;
          const hot = index > segments - 3;
          const warm = index > segments - 7;
          const color = hot ? colors.danger : warm ? colors.warn : colors.good;
          return (
            <View
              key={index}
              style={[
                styles.segment,
                { backgroundColor: on ? color : colors.meterTrack, opacity: on ? 1 : 0.9 },
              ]}
            />
          );
        })}
      </View>
      <Text style={[styles.meterDb, { color: clipping ? colors.danger : colors.text }]}>
        {db <= -48 ? '−∞' : `${db.toFixed(1)}`}
      </Text>
      <View style={[styles.clip, { backgroundColor: clipping ? colors.danger : colors.surface2 }]}>
        <Text style={[styles.clipText, { color: clipping ? '#fff' : colors.faint }]}>CLIP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vHit: { width: 54, justifyContent: 'flex-end', alignItems: 'center' },
  hHit: { height: 36, justifyContent: 'center' },
  vTrack: { position: 'absolute', width: 6, top: 10, bottom: 10, borderRadius: 99 },
  hTrack: { height: 6, borderRadius: 99, marginHorizontal: 10 },
  vFill: { position: 'absolute', width: 6, bottom: 10, borderRadius: 99 },
  hFill: { position: 'absolute', left: 10, height: 6, borderRadius: 99 },
  vThumb: {
    position: 'absolute',
    width: 28,
    height: 18,
    marginBottom: -9,
    borderRadius: 6,
    borderWidth: 2,
  },
  hThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    marginLeft: 1,
    borderRadius: 9,
    borderWidth: 2,
  },
  vTick: { position: 'absolute', width: 14, height: 2, marginBottom: -1 },
  hTick: { position: 'absolute', width: 2, height: 12, marginLeft: 7 },
  meterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  segments: { flex: 1, flexDirection: 'row', gap: 3, height: 16, alignItems: 'stretch' },
  segment: { flex: 1, borderRadius: 2 },
  meterDb: { width: 52, textAlign: 'right', fontFamily: font.mono, fontSize: 12 },
  clip: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  clipText: { fontFamily: font.bold, fontSize: 10, letterSpacing: 0.6 },
});
