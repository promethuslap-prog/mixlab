import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Muted, ProgressBar, Screen, Title } from '@/components/ui';
import { tracks } from '@/content/lessons';
import { useProgress } from '@/storage/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function LearnScreen() {
  const { colors } = useTheme();
  const progress = useProgress();

  return (
    <Screen scroll>
      <Title>Three ways in.</Title>
      <Muted style={styles.lede}>Basics first if you are new. Live and Studio assume you know what a fader is.</Muted>
      {tracks.map((track) => {
        const stats = progress.trackStats(track.id);
        return (
          <Pressable
            key={track.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/track/[trackId]', params: { trackId: track.id } })}
            style={styles.card}
          >
            <Card>
              <Text style={[styles.eyebrow, { color: track.color }]}>{track.eyebrow}</Text>
              <Text style={[styles.name, { color: colors.text }]}>{track.title}</Text>
              <Muted>{track.summary}</Muted>
              <View style={styles.bar}>
                <ProgressBar fraction={stats.fraction} color={track.color} />
              </View>
              <View style={styles.meta}>
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {stats.done}/{stats.total} lessons
                </Text>
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {stats.quiz ? `Best quiz ${stats.quiz.correct}/${stats.quiz.total}` : 'Quiz not taken'}
                </Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: { marginTop: 8, marginBottom: 8 },
  card: { marginTop: 12 },
  eyebrow: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' },
  name: { fontFamily: font.bold, fontSize: 26, letterSpacing: -0.4, marginTop: 4, marginBottom: 4 },
  bar: { marginTop: 14, marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metaText: { fontFamily: font.medium, fontSize: 13 },
});
