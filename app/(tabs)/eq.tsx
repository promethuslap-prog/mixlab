import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAudio } from '@/audio/AudioEngine';
import type { EqListenMode } from '@/audio/types';
import { ValueSlider } from '@/components/controls';
import { Card, Muted, Screen, Title } from '@/components/ui';
import { describeFrequency } from '@/content/eqGuide';
import { formatHz, hzToPosition, positionToHz } from '@/lib/levels';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function EqScreen() {
  const { colors } = useTheme();
  const audio = useAudio();
  const [hz, setHz] = useState(1000);
  const [mode, setMode] = useState<EqListenMode>('noise');
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(audio);
  const live = useRef({ hz, mode, volume, playing: false });
  audioRef.current = audio;
  live.current = { hz, mode, volume, playing: audio.playing };

  useFocusEffect(
    useCallback(() => {
      return () => audioRef.current.stop();
    }, []),
  );

  const info = describeFrequency(hz);

  const playOrUpdate = (nextHz: number, nextMode: EqListenMode, nextVolume: number, force: boolean) => {
    if (force || live.current.playing) audio.playEq(nextHz, nextMode, nextVolume);
  };

  return (
    <Screen scroll>
      <Title>EQ explorer</Title>
      <Muted style={styles.lede}>
        Drag across what you can hear. Each band names the problem it usually causes, and which instruments live there.
      </Muted>

      <Card style={styles.hero}>
        <Text style={[styles.band, { color: colors.accent }]}>{info.title}</Text>
        <Text style={[styles.hz, { color: colors.text }]}>{formatHz(hz)}</Text>
        <Text style={[styles.range, { color: colors.muted }]}>{info.range}</Text>
        <ValueSlider
          value={hzToPosition(hz)}
          min={0}
          max={1}
          color={colors.accent}
          accessibilityLabel="Frequency"
          valueText={formatHz(hz)}
          onChange={(position) => {
            const next = positionToHz(position);
            setHz(next);
            playOrUpdate(next, mode, volume, false);
          }}
        />
        <View style={styles.scale}>
          <Text style={[styles.scaleText, { color: colors.faint }]}>20 Hz</Text>
          <Text style={[styles.scaleText, { color: colors.faint }]}>1 kHz</Text>
          <Text style={[styles.scaleText, { color: colors.faint }]}>20 kHz</Text>
        </View>
        <View style={styles.modes}>
          <ModeChip label="Noise band" selected={mode === 'noise'} onPress={() => { setMode('noise'); playOrUpdate(hz, 'noise', volume, false); }} />
          <ModeChip label="Tone" selected={mode === 'tone'} onPress={() => { setMode('tone'); playOrUpdate(hz, 'tone', volume, false); }} />
        </View>
        <Text style={[styles.volLabel, { color: colors.muted }]}>Volume</Text>
        <ValueSlider
          value={volume}
          min={0}
          max={1}
          color={colors.good}
          accessibilityLabel="Explorer volume"
          valueText={`${Math.round(volume * 100)} percent`}
          onChange={(next) => {
            setVolume(next);
            playOrUpdate(hz, mode, next, false);
          }}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => (audio.playing ? audio.stop() : playOrUpdate(hz, mode, volume, true))}
          style={[styles.play, { backgroundColor: audio.playing ? colors.danger : colors.accent }]}
        >
          <Ionicons name={audio.playing ? 'stop' : 'play'} color="#fff" size={18} />
          <Text style={styles.playText}>{audio.busy ? 'Starting' : audio.playing ? 'Stop' : 'Play this band'}</Text>
        </Pressable>
        {audio.error ? <Text style={[styles.error, { color: colors.danger }]}>{audio.error}</Text> : null}
      </Card>

      <Info title="What you hear" body={info.hear} />
      <Info title="Common problems" body={info.problems} />
      <Info title="A fix that usually works" body={info.fixes} />
      <Info title="Instruments that live here" body={info.instruments} />
      <Muted style={styles.foot}>
        A phone speaker hides the lowest octave. The level also dips a little around 3 kHz, where ears are most sensitive, so sweeping does not blast you.
      </Muted>
    </Screen>
  );
}

function ModeChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? colors.accent : colors.surface2, borderColor: selected ? colors.accent : colors.border },
      ]}
    >
      <Text style={{ fontFamily: font.semibold, fontSize: 14, color: selected ? colors.onAccent : colors.text }}>{label}</Text>
    </Pressable>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.info}>
      <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.infoBody, { color: colors.muted }]}>{body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  lede: { marginTop: 8, marginBottom: 14 },
  hero: { paddingBottom: 14 },
  band: { fontFamily: font.semibold, fontSize: 13, letterSpacing: 0.6, textTransform: 'uppercase' },
  hz: { fontFamily: font.bold, fontSize: 42, letterSpacing: -1, marginTop: 2 },
  range: { fontFamily: font.medium, fontSize: 14, marginBottom: 6 },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  scaleText: { fontFamily: font.medium, fontSize: 11 },
  modes: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: { flex: 1, minHeight: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  volLabel: { fontFamily: font.medium, fontSize: 13, marginTop: 12 },
  play: {
    marginTop: 12,
    minHeight: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playText: { color: '#fff', fontFamily: font.semibold, fontSize: 16 },
  error: { marginTop: 8, fontFamily: font.medium, fontSize: 13 },
  info: { marginTop: 10 },
  infoTitle: { fontFamily: font.semibold, fontSize: 16, marginBottom: 4 },
  infoBody: { fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  foot: { marginTop: 14 },
});
