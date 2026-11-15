import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { delayTimes, formatMs } from '@/lib/delayMath';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

const ROWS = [
  ['Quarter note', 'quarter'],
  ['Eighth note', 'eighth'],
  ['Dotted eighth', 'dottedEighth'],
  ['Quarter triplet', 'quarterTriplet'],
  ['Sixteenth note', 'sixteenth'],
] as const;

export function DelayCalculator() {
  const { colors } = useTheme();
  const [bpm, setBpm] = useState(120);
  const times = delayTimes(bpm);

  return (
    <Card>
      <Text style={[styles.kicker, { color: colors.accent }]}>Delay time</Text>
      <Text style={[styles.formula, { color: colors.text }]}>Quarter note (ms) = 60,000 ÷ BPM</Text>
      <View style={styles.bpmRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Slower tempo"
          onPress={() => setBpm((value) => Math.max(60, value - 1))}
          style={[styles.step, { backgroundColor: colors.surface2 }]}
        >
          <Text style={[styles.stepText, { color: colors.text }]}>−</Text>
        </Pressable>
        <View style={styles.bpm}>
          <Text style={[styles.bpmValue, { color: colors.text }]}>{bpm}</Text>
          <Text style={[styles.bpmUnit, { color: colors.muted }]}>BPM</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Faster tempo"
          onPress={() => setBpm((value) => Math.min(180, value + 1))}
          style={[styles.step, { backgroundColor: colors.surface2 }]}
        >
          <Text style={[styles.stepText, { color: colors.text }]}>+</Text>
        </Pressable>
      </View>
      {ROWS.map(([label, key]) => (
        <View key={key} style={[styles.row, { borderTopColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>{formatMs(times[key])}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  kicker: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' },
  formula: { fontFamily: font.medium, fontSize: 15, marginTop: 6, marginBottom: 12 },
  bpmRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  step: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontFamily: font.semibold, fontSize: 24 },
  bpm: { flex: 1, alignItems: 'center' },
  bpmValue: { fontFamily: font.bold, fontSize: 32, letterSpacing: -0.5 },
  bpmUnit: { fontFamily: font.medium, fontSize: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1 },
  rowLabel: { fontFamily: font.medium, fontSize: 14 },
  rowValue: { fontFamily: font.mono, fontSize: 14 },
});
