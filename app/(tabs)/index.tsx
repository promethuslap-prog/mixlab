import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Card, Muted, ProgressBar, Screen, Title } from '@/components/ui';
import { lessonKey, tracks } from '@/content/lessons';
import { useProgress } from '@/storage/ProgressProvider';
import { useTheme, type ThemeMode } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function HomeScreen() {
  const { colors, mode, setMode } = useTheme();
  const progress = useProgress();
  const next = tracks
    .flatMap((track) => track.lessons.map((lesson) => ({ track, lesson })))
    .find(({ track, lesson }) => !progress.completed[lessonKey(track.id, lesson.id)]);

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <Text style={[styles.wordmark, { color: colors.text }]}>MIX LAB</Text>
        <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.pillText, { color: colors.accent }]}>13–18</Text>
        </View>
      </View>
      <Title>Learn to mix with your ears.</Title>
      <Body style={styles.lede}>
        Short lessons on live shows and studio sessions, then a six-channel mixer you can actually hear.
      </Body>

      <View style={[styles.modes, { backgroundColor: colors.surface2 }]}>
        {(['system', 'light', 'dark'] as ThemeMode[]).map((option) => {
          const selected = mode === option;
          const label = option === 'system' ? 'System' : option === 'light' ? 'Light' : 'Dark';
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setMode(option)}
              style={[styles.mode, { backgroundColor: selected ? colors.accent : 'transparent' }]}
            >
              <Text style={{ fontFamily: font.semibold, fontSize: 13, color: selected ? colors.onAccent : colors.muted }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/progress' as Href)}
        style={styles.block}
      >
        <Card>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Your progress</Text>
            <Text style={[styles.cardMeta, { color: colors.muted }]}>
              {progress.overall.done}/{progress.overall.total} lessons
            </Text>
          </View>
          <ProgressBar fraction={progress.overall.fraction} />
          <Muted style={styles.cardHint}>Lessons and quiz scores stay on this phone.</Muted>
        </Card>
      </Pressable>

      {next ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/lesson/[trackId]/[lessonId]',
              params: { trackId: next.track.id, lessonId: next.lesson.id },
            })
          }
        >
          <Card style={{ ...styles.continue, backgroundColor: colors.accent }}>
            <Text style={[styles.continueKicker, { color: 'rgba(255,255,255,0.8)' }]}>Continue · {next.track.title}</Text>
            <Text style={styles.continueTitle}>{next.lesson.title}</Text>
            <Text style={styles.continueMeta}>{next.lesson.minutes} min</Text>
          </Card>
        </Pressable>
      ) : (
        <Card style={styles.block}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>You finished the lessons.</Text>
          <Muted>Retake a quiz, or open the mixer and fix the problem preset by ear.</Muted>
        </Card>
      )}

      <Text style={[styles.section, { color: colors.muted }]}>Tracks</Text>
      {tracks.map((track) => {
        const stats = progress.trackStats(track.id);
        return (
          <Pressable
            key={track.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/track/[trackId]', params: { trackId: track.id } })}
            style={styles.block}
          >
            <Card>
              <View style={styles.rowBetween}>
                <View style={[styles.swatch, { backgroundColor: track.color }]} />
                <View style={styles.flex}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{track.title}</Text>
                  <Muted>{track.summary}</Muted>
                </View>
                <Ionicons name="chevron-forward" color={colors.faint} size={18} />
              </View>
              <View style={styles.progressGap}>
                <ProgressBar fraction={stats.fraction} color={track.color} />
              </View>
              <Muted>
                {stats.done}/{stats.total} lessons
                {stats.quiz ? ` · quiz ${stats.quiz.correct}/${stats.quiz.total}` : ''}
              </Muted>
            </Card>
          </Pressable>
        );
      })}

      <Text style={[styles.section, { color: colors.muted }]}>Practice</Text>
      <View style={styles.practice}>
        <PracticeCard
          icon="options"
          title="Mixer"
          body="Faders, pan, and EQ on a looping band."
          onPress={() => router.push('/mixer' as Href)}
        />
        <PracticeCard
          icon="pulse"
          title="EQ explorer"
          body="Hear a band from 20 Hz to 20 kHz."
          onPress={() => router.push('/eq' as Href)}
        />
      </View>
      </Screen>
  );
}

function PracticeCard({
  icon,
  title,
  body,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.flex}>
      <Card style={styles.practiceCard}>
        <Ionicons name={icon} size={20} color={colors.accent} />
        <Text style={[styles.cardTitle, { color: colors.text, marginTop: 10 }]}>{title}</Text>
        <Muted>{body}</Muted>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
  wordmark: { fontFamily: font.bold, fontSize: 14, letterSpacing: 1.6 },
  pill: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontFamily: font.semibold, fontSize: 12 },
  lede: { marginTop: 10 },
  modes: { flexDirection: 'row', borderRadius: 12, padding: 3, marginTop: 18 },
  mode: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 9 },
  block: { marginTop: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontFamily: font.semibold, fontSize: 16 },
  cardMeta: { fontFamily: font.medium, fontSize: 13 },
  cardHint: { marginTop: 8 },
  continue: { marginTop: 12 },
  continueKicker: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' },
  continueTitle: { fontFamily: font.bold, fontSize: 22, color: '#fff', marginTop: 4 },
  continueMeta: { fontFamily: font.medium, fontSize: 13, color: 'rgba(255,255,255,0.82)', marginTop: 4 },
  section: { marginTop: 22, marginBottom: 4, fontFamily: font.semibold, fontSize: 13, letterSpacing: 0.4, textTransform: 'uppercase' },
  swatch: { width: 10, height: 36, borderRadius: 99 },
  flex: { flex: 1 },
  progressGap: { marginTop: 12, marginBottom: 8 },
  practice: { flexDirection: 'row', gap: 10 },
  practiceCard: { minHeight: 148 },
});
