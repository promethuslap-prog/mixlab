import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export function Screen({
  children,
  scroll = false,
  edges = ['top', 'left', 'right'],
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function TopBar({
  title,
  back = false,
  right,
}: {
  title?: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.topBar}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      <Text style={[styles.topTitle, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.iconSlot}>{right}</View>
    </View>
  );
}

export function Eyebrow({ children }: { children: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.eyebrow, { color: colors.accent }]}>{children}</Text>;
}

export function Title({ children }: { children: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.title, { color: colors.text }]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const { colors } = useTheme();
  return <Text style={[styles.body, { color: colors.text }, style]}>{children}</Text>;
}

export function Muted({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const { colors } = useTheme();
  return <Text style={[styles.muted, { color: colors.muted }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function Button({
  label,
  onPress,
  tone = 'primary',
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const background =
    tone === 'primary' ? colors.accent : tone === 'secondary' ? colors.surface2 : 'transparent';
  const textColor = tone === 'primary' ? colors.onAccent : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          borderColor: tone === 'ghost' ? colors.border : 'transparent',
          borderWidth: tone === 'ghost' ? 1 : 0,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ fraction, color }: { fraction: number; color?: string }) {
  const { colors } = useTheme();
  const width = `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%` as `${number}%`;
  return (
    <View style={[styles.track, { backgroundColor: colors.surface2 }]}>
      <View style={[styles.fill, { width, backgroundColor: color ?? colors.accent }]} />
    </View>
  );
}

export function Tip({ children }: { children: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tip, { backgroundColor: colors.warnSoft }]}>
      <Ionicons name="bulb-outline" size={18} color={colors.warn} />
      <View style={styles.flex}>
        <Text style={[styles.tipLabel, { color: colors.warn }]}>Tip</Text>
        <Text style={[styles.tipBody, { color: colors.text }]}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 36 },
  topBar: { minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: font.semibold, fontSize: 16 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconSlot: { minWidth: 40, alignItems: 'flex-end', justifyContent: 'center' },
  eyebrow: {
    fontFamily: font.semibold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { fontFamily: font.bold, fontSize: 30, letterSpacing: -0.6, lineHeight: 36 },
  body: { fontFamily: font.regular, fontSize: 16, lineHeight: 23 },
  muted: { fontFamily: font.regular, fontSize: 14, lineHeight: 20 },
  card: { borderRadius: 18, borderWidth: 1, padding: 16 },
  button: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { fontFamily: font.semibold, fontSize: 16 },
  track: { height: 8, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  tip: { borderRadius: 16, padding: 14, flexDirection: 'row', gap: 10 },
  tipLabel: { fontFamily: font.semibold, fontSize: 13, marginBottom: 2 },
  tipBody: { fontFamily: font.regular, fontSize: 15, lineHeight: 21 },
});
