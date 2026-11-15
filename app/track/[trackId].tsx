import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Muted, ProgressBar, Screen, TopBar } from '@/components/ui';
import { findTrack } from '@/content/lessons';
import { quizFor } from '@/content/quizzes';
import { useProgress } from '@/storage/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function TrackScreen() {
  const { trackId } = useLocalSearchParams<{ trackId: string }>();
  const track = findTrack(String(trackId));
  const { colors } = useTheme();
  const progress = useProgress();

  if (!track) {
    return (
      <Screen>
        <TopBar back title="Tracks" />
        <View style={styles.missing}>
          <Text style={[styles.missingText, { color: colors.text }]}>That track is not in Mix Lab.</Text>
        </View>
      </Screen>
    );
  }

  const stats = progress.trackStats(track.id);
  const questions = quizFor(track.id)?.length ?? 0;

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <TopBar back title={track.title} />
      <Text style={[styles.eyebrow, { color: track.color }]}>{track.eyebrow}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{track.title}</Text>
      <Muted>{track.summary}</Muted>
      <View style={styles.bar}>
        <ProgressBar fraction={stats.fraction} color={track.color} />
      </View>
      <Muted>
        {stats.done} of {stats.total} lessons done
      </Muted>
      {track.lessons.map((lesson, index) => {
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
            style={styles.item}
          >
            <Card>
              <View style={styles.itemRow}>
                <View style={[styles.index, { backgroundColor: done ? track.color : colors.surface2 }]}>
                  {done ? (
                    <Ionicons name="checkmark" color="#fff" size={16} />
                  ) : (
                    <Text style={[styles.indexText, { color: colors.text }]}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.lesson, { color: colors.text }]}>{lesson.title}</Text>
                  <Muted>
                    {lesson.minutes} min · {lesson.steps.length} steps
                  </Muted>
                </View>
                <Ionicons name="chevron-forward" color={colors.faint} size={18} />
              </View>
            </Card>
          </Pressable>
        );
      })}
      <View style={styles.quiz}>
        <Card>
          <Text style={[styles.lesson, { color: colors.text }]}>
            {track.title} quiz · {questions} questions
          </Text>
          <Muted style={styles.quizCopy}>
            {stats.quiz
              ? `Best score ${stats.quiz.correct} of ${stats.quiz.total}. You can retake it.`
              : 'Instant feedback on each question. Your best score is saved on this phone.'}
          </Muted>
          <Button
            label={stats.quiz ? 'Retake quiz' : 'Start quiz'}
            onPress={() => router.push({ pathname: '/quiz/[trackId]', params: { trackId: track.id } })}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { padding: 20 },
  missingText: { fontFamily: font.semibold, fontSize: 16 },
  eyebrow: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.7, textTransform: 'uppercase', marginTop: 8 },
  title: { fontFamily: font.bold, fontSize: 32, letterSpacing: -0.6, marginBottom: 6 },
  bar: { marginTop: 14, marginBottom: 8 },
  item: { marginTop: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  index: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  indexText: { fontFamily: font.bold, fontSize: 14 },
  flex: { flex: 1 },
  lesson: { fontFamily: font.semibold, fontSize: 16 },
  quiz: { marginTop: 16 },
  quizCopy: { marginTop: 4, marginBottom: 12 },
});
