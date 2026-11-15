import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Muted, ProgressBar, Screen, TopBar } from '@/components/ui';
import { tracks } from '@/content/lessons';
import { useProgress } from '@/storage/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const progress = useProgress();

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <TopBar back title="Progress" />
      <Text style={[styles.score, { color: colors.text }]}>
        {Math.round(progress.overall.fraction * 100)}%
      </Text>
      <Muted>Lessons marked complete. Quizzes keep your best score.</Muted>
      <View style={styles.bar}>
        <ProgressBar fraction={progress.overall.fraction} />
      </View>
      {tracks.map((track) => {
        const stats = progress.trackStats(track.id);
        return (
          <View key={track.id} style={styles.block}>
            <Card>
              <View style={styles.head}>
                <Text style={[styles.track, { color: colors.text }]}>{track.title}</Text>
                <Text style={[styles.meta, { color: colors.muted }]}>
                  {stats.done}/{stats.total}
                </Text>
              </View>
              <ProgressBar fraction={stats.fraction} color={track.color} />
              <Muted style={styles.quizLine}>
                {stats.quiz ? `Quiz best ${stats.quiz.correct}/${stats.quiz.total}` : 'Quiz not taken yet'}
              </Muted>
              {track.lessons.map((lesson) => {
                const done = progress.isComplete(track.id, lesson.id);
                return (
                  <Pressable
                    key={lesson.id}
                    accessibilityRole="button"
                    onPress={() =>
                      router.push({
                        pathname: '/lesson/[trackId]/[lessonId]',
                        params: { trackId: track.id, lessonId: lesson.id },
                      })
                    }
                    style={styles.lesson}
                  >
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'ellipse-outline'}
                      color={done ? track.color : colors.faint}
                      size={18}
                    />
                    <Text style={[styles.lessonText, { color: colors.text }]}>{lesson.title}</Text>
                  </Pressable>
                );
              })}
            </Card>
          </View>
        );
      })}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          Alert.alert('Reset progress?', 'This clears lesson checkmarks and quiz scores on this phone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => progress.reset() },
          ]);
        }}
        style={styles.reset}
      >
        <Text style={[styles.resetText, { color: colors.danger }]}>Reset progress</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  score: { fontFamily: font.bold, fontSize: 48, letterSpacing: -1, marginTop: 8 },
  bar: { marginTop: 12, marginBottom: 8 },
  block: { marginTop: 12 },
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  track: { fontFamily: font.semibold, fontSize: 18 },
  meta: { fontFamily: font.medium, fontSize: 14 },
  quizLine: { marginTop: 8 },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  lessonText: { fontFamily: font.medium, fontSize: 15 },
  reset: { alignItems: 'center', paddingVertical: 22 },
  resetText: { fontFamily: font.semibold, fontSize: 15 },
});
