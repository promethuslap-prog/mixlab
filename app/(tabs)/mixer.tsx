import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAudio } from '@/audio/AudioEngine';
import { PRESETS, PRESET_META, cloneMix, mixesMatch, type PresetId } from '@/audio/presets';
import { CHANNELS, LOOP_INFO, type ChannelId, type ChannelMix, type MixGraphState } from '@/audio/types';
import { Meter, ValueSlider } from '@/components/controls';
import { analyzeMix, likelyClipping } from '@/lib/mixFeedback';
import { formatDb, formatEq, formatPan } from '@/lib/levels';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function MixerScreen() {
  const { colors } = useTheme();
  const audio = useAudio();
  const params = useLocalSearchParams<{ preset?: string }>();
  const [mix, setMix] = useState<MixGraphState>(() => cloneMix(PRESETS.good));
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [pageScroll, setPageScroll] = useState(true);
  const latest = useRef(mix);
  const audioRef = useRef(audio);
  audioRef.current = audio;
  latest.current = mix;

  useEffect(() => {
    if (params.preset !== 'problem') return;
    const next = cloneMix(PRESETS.problem);
    latest.current = next;
    setMix(next);
    audioRef.current.updateMix(next);
  }, [params.preset]);

  useFocusEffect(
    useCallback(() => {
      return () => audioRef.current.stop();
    }, []),
  );

  const push = (next: MixGraphState) => {
    latest.current = next;
    setMix(next);
    audio.updateMix(next);
  };

  const applyPreset = (id: PresetId) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
    push(cloneMix(PRESETS[id]));
  };

  const updateChannel = (id: ChannelId, partial: Partial<ChannelMix>) => {
    const current = latest.current;
    push({
      ...current,
      channels: { ...current.channels, [id]: { ...current.channels[id], ...partial } },
    });
  };

  const active = PRESET_META.find((preset) => mixesMatch(mix, PRESETS[preset.id]))?.id;
  const clipping = audio.playing ? audio.meter.clipping : likelyClipping(mix);
  const notes = analyzeMix(mix, clipping);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <View style={styles.flex}>
        <ScrollView
          scrollEnabled={pageScroll}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleRow}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Mixer</Text>
              <Text style={[styles.sub, { color: colors.muted }]}>
                {LOOP_INFO.bpm} BPM · {LOOP_INFO.key} · synthesized loop
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={audio.playing ? 'Stop the loop' : 'Play the loop'}
              onPress={() => (audio.playing ? audio.stop() : audio.playMixer(latest.current))}
              style={[styles.play, { backgroundColor: audio.playing ? colors.danger : colors.accent }]}
            >
              <Ionicons name={audio.playing ? 'stop' : 'play'} color={colors.onAccent} size={18} />
              <Text style={[styles.playText, { color: colors.onAccent }]}>
                {audio.busy ? 'Starting' : audio.playing ? 'Stop' : 'Play'}
              </Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presets}>
            {PRESET_META.map((preset) => {
              const selected = active === preset.id;
              return (
                <Pressable
                  key={preset.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => applyPreset(preset.id)}
                  style={[
                    styles.preset,
                    {
                      backgroundColor: selected ? colors.accentSoft : colors.surface,
                      borderColor: selected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.presetLabel, { color: colors.text }]}>{preset.label}</Text>
                  <Text style={[styles.presetDetail, { color: colors.muted }]}>{preset.detail}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {audio.error ? (
            <View style={[styles.note, { backgroundColor: colors.dangerSoft }]}>
              <Text style={[styles.noteTitle, { color: colors.danger }]}>Audio did not start</Text>
              <Text style={[styles.noteBody, { color: colors.text }]}>{audio.error}</Text>
            </View>
          ) : null}

          {notes.map((note) => {
            const tone =
              note.tone === 'bad' ? colors.danger : note.tone === 'warn' ? colors.warn : note.tone === 'good' ? colors.good : colors.accent;
            const soft =
              note.tone === 'bad'
                ? colors.dangerSoft
                : note.tone === 'warn'
                  ? colors.warnSoft
                  : note.tone === 'good'
                    ? colors.goodSoft
                    : colors.infoSoft;
            return (
              <View key={note.id} style={[styles.note, { backgroundColor: soft }]}>
                <Text style={[styles.noteTitle, { color: tone }]}>{note.title}</Text>
                <Text style={[styles.noteBody, { color: colors.text }]}>{note.body}</Text>
              </View>
            );
          })}

          <Text style={[styles.hint, { color: colors.faint }]}>
            Headphones show the low end a phone speaker hides. The vocal is a synth line, not a person. Snare includes a light hi-hat.
          </Text>

          <ScrollView
            horizontal
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.strips}
          >
            {CHANNELS.map((channel) => (
              <ChannelStrip
                key={channel.id}
                id={channel.id}
                name={channel.name}
                hint={channel.hint}
                color={channel.color}
                value={mix.channels[channel.id]}
                onChange={(partial) => updateChannel(channel.id, partial)}
                onSliding={(enabled) => {
                  setScrollEnabled(enabled);
                  setPageScroll(enabled);
                }}
              />
            ))}
          </ScrollView>
        </ScrollView>

        <View style={[styles.master, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.masterHead}>
            <Text style={[styles.masterLabel, { color: colors.text }]}>Master</Text>
            <Text style={[styles.masterDb, { color: colors.text }]}>{formatDb(mix.masterDb)}</Text>
          </View>
          <ValueSlider
            value={mix.masterDb}
            min={-24}
            max={6}
            detent={0}
            detentWindow={0.35}
            color={colors.accent}
            accessibilityLabel="Master fader"
            valueText={`${formatDb(mix.masterDb)} decibels`}
            onChange={(masterDb) => push({ ...latest.current, masterDb })}
          />
          <Meter db={audio.playing ? audio.meter.db : -96} clipping={audio.playing && audio.meter.clipping} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ChannelStrip({
  id,
  name,
  hint,
  color,
  value,
  onChange,
  onSliding,
}: {
  id: ChannelId;
  name: string;
  hint: string;
  color: string;
  value: ChannelMix;
  onChange: (partial: Partial<ChannelMix>) => void;
  onSliding: (enabled: boolean) => void;
}) {
  const { colors } = useTheme();
  const lock = (active: boolean) => onSliding(!active);
  return (
    <View style={[styles.strip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.stripe, { backgroundColor: color }]} />
      <Text style={[styles.stripName, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.stripHint, { color: colors.muted }]}>{hint}</Text>
      <View style={styles.msRow}>
        <Toggle label="M" active={value.mute} color={colors.danger} onPress={() => onChange({ mute: !value.mute })} />
        <Toggle label="S" active={value.solo} color={colors.warn} onPress={() => onChange({ solo: !value.solo })} />
      </View>
      <ValueSlider
        vertical
        height={168}
        value={value.gainDb}
        min={-48}
        max={6}
        detent={0}
        detentWindow={0.45}
        color={color}
        accessibilityLabel={`${name} fader`}
        valueText={`${formatDb(value.gainDb)} decibels`}
        onChange={(gainDb) => onChange({ gainDb })}
        onSliding={(active) => onSliding(!active)}
      />
      <Text style={[styles.db, { color: colors.text }]}>{formatDb(value.gainDb)}</Text>
      <Text style={[styles.miniLabel, { color: colors.faint }]}>Pan {formatPan(value.pan)}</Text>
      <ValueSlider
        value={value.pan}
        min={-1}
        max={1}
        detent={0}
        detentWindow={0.06}
        color={color}
        accessibilityLabel={`${name} pan`}
        valueText={formatPan(value.pan)}
        onChange={(pan) => onChange({ pan })}
        onSliding={lock}
      />
      <EqRow
        label="Low"
        hz="120"
        value={value.low}
        color={color}
        onChange={(low) => onChange({ low })}
        onSliding={lock}
        channel={id}
      />
      <EqRow
        label="Mid"
        hz="1k"
        value={value.mid}
        color={color}
        onChange={(mid) => onChange({ mid })}
        onSliding={lock}
        channel={id}
      />
      <EqRow
        label="High"
        hz="8k"
        value={value.high}
        color={color}
        onChange={(high) => onChange({ high })}
        onSliding={lock}
        channel={id}
      />
    </View>
  );
}

function EqRow({
  label,
  hz,
  value,
  color,
  onChange,
  onSliding,
  channel,
}: {
  label: string;
  hz: string;
  value: number;
  color: string;
  onChange: (value: number) => void;
  onSliding: (active: boolean) => void;
  channel: ChannelId;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.eq}>
      <View style={styles.eqLabel}>
        <Text style={[styles.miniLabel, { color: colors.faint }]}>
          {label} {hz}
        </Text>
        <Text style={[styles.eqValue, { color: colors.text }]}>{formatEq(value)}</Text>
      </View>
      <ValueSlider
        value={value}
        min={-12}
        max={12}
        detent={0}
        detentWindow={0.45}
        color={color}
        accessibilityLabel={`${channel} ${label} EQ`}
        valueText={`${formatEq(value)} decibels`}
        onChange={onChange}
        onSliding={onSliding}
      />
    </View>
  );
}

function Toggle({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[
        styles.toggle,
        { backgroundColor: active ? color : colors.surface2, borderColor: active ? color : colors.border },
      ]}
    >
      <Text style={[styles.toggleText, { color: active ? '#1A1206' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  title: { fontFamily: font.bold, fontSize: 30, letterSpacing: -0.5 },
  sub: { fontFamily: font.medium, fontSize: 13, marginTop: 2 },
  play: { minHeight: 48, borderRadius: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 6 },
  playText: { fontFamily: font.semibold, fontSize: 16 },
  presets: { gap: 8, paddingVertical: 14 },
  preset: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8, minWidth: 132 },
  presetLabel: { fontFamily: font.semibold, fontSize: 14 },
  presetDetail: { fontFamily: font.regular, fontSize: 12, marginTop: 2 },
  note: { borderRadius: 14, padding: 12, marginBottom: 8 },
  noteTitle: { fontFamily: font.semibold, fontSize: 14, marginBottom: 3 },
  noteBody: { fontFamily: font.regular, fontSize: 14, lineHeight: 20 },
  hint: { fontFamily: font.regular, fontSize: 12, lineHeight: 17, marginBottom: 12 },
  strips: { gap: 10, paddingRight: 8 },
  strip: { width: 168, borderRadius: 18, borderWidth: 1, padding: 12, marginRight: 10 },
  stripe: { height: 4, borderRadius: 99, marginBottom: 8 },
  stripName: { fontFamily: font.bold, fontSize: 15 },
  stripHint: { fontFamily: font.regular, fontSize: 12, marginBottom: 8 },
  msRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  toggle: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  toggleText: { fontFamily: font.bold, fontSize: 13 },
  db: { textAlign: 'center', fontFamily: font.mono, fontSize: 13, marginTop: 4 },
  miniLabel: { fontFamily: font.medium, fontSize: 11 },
  eq: { marginTop: 2 },
  eqLabel: { flexDirection: 'row', justifyContent: 'space-between' },
  eqValue: { fontFamily: font.mono, fontSize: 11 },
  master: { borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  masterHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  masterLabel: { fontFamily: font.semibold, fontSize: 15 },
  masterDb: { fontFamily: font.mono, fontSize: 13 },
});
