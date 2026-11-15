import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { DelayCalculator } from '@/components/DelayCalculator';
import { Button, Card, Muted, Screen, Tip, TopBar } from '@/components/ui';
import { findLesson } from '@/content/lessons';
import { useProgress } from '@/storage/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function LessonScreen() {
  const { trackId, lessonId } = useLocalSearchParams<{ trackId: string; lessonId: string }>();
  const found = findLesson(String(trackId), String(lessonId));
  const { colors } = useTheme();
  const progress = useProgress();

  if (!found) {
    return (
      <Screen>
        <TopBar back title="Lesson" />
        <View style={styles.pad}>
          <Text style={[styles.missing, { color: colors.text }]}>That lesson is not in Mix Lab.</Text>
        </View>
      </Screen>
    );
  }

  const { track, lesson, index, next } = found;
  const done = progress.isComplete(track.id, lesson.id);

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <TopBar back title={track.title} />
      <Text style={[styles.kicker, { color: track.color }]}>
        Lesson {index + 1} of {track.lessons.length} · {lesson.minutes} min
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>{lesson.title}</Text>
      <Muted style={styles.summary}>{lesson.summary}</Muted>

      {lesson.signal ? (
        <View style={styles.chain}>
          {lesson.signal.map((step, stepIndex) => (
            <View key={step} style={styles.chainItem}>
              <View style={[styles.chainPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.chainText, { color: colors.text }]}>{step}</Text>
              </View>
              {stepIndex < lesson.signal!.length - 1 ? (
                <Text style={[styles.arrow, { color: colors.faint }]}>→</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {lesson.steps.map((step, stepIndex) => (
        <Card key={step.title} style={styles.step}>
          <Text style={[styles.stepIndex, { color: track.color }]}>Step {stepIndex + 1}</Text>
          <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
          <Text style={[styles.stepBody, { color: colors.muted }]}>{step.body}</Text>
        </Card>
      ))}

      <View style={styles.tip}>
        <Tip>{lesson.tip}</Tip>
      </View>

      {lesson.delayCalculator ? (
        <View style={styles.tip}>
          <DelayCalculator />
        </View>
      ) : null}

      {lesson.links?.map((link) => (
        <View key={link.label} style={styles.link}>
          <Button
            label={link.label}
            tone="secondary"
            icon={link.href === '/eq' ? 'pulse' : 'options'}
            onPress={() => {
              if (link.preset) router.push({ pathname: link.href, params: { preset: link.preset } } as Href);
              else router.push(link.href);
            }}
          />
        </View>
      ))}

      <View style={styles.actions}>
        <Button
          label={done ? 'Completed' : 'Mark lesson complete'}
          icon={done ? 'checkmark' : undefined}
          tone={done ? 'secondary' : 'primary'}
          onPress={() => {
            if (done) return;
            progress.markComplete(track.id, lesson.id);
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          }}
        />
        {next ? (
          <View style={styles.link}>
            <Button
              label={`Next: ${next.title}`}
              tone="ghost"
              onPress={() =>
                router.replace({
                  pathname: '/lesson/[trackId]/[lessonId]',
                  params: { trackId: track.id, lessonId: next.id },
                })
              }
            />
          </View>
        ) : (
          <View style={styles.link}>
            <Button
              label="Take the quiz"
              tone="ghost"
              onPress={() => router.push({ pathname: '/quiz/[trackId]', params: { trackId: track.id } })}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20 },
  missing: { fontFamily: font.semibold, fontSize: 16 },
  kicker: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 8 },
  title: { fontFamily: font.bold, fontSize: 30, letterSpacing: -0.5, marginTop: 4 },
  summary: { marginTop: 8 },
  chain: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 16, gap: 6 },
  chainItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chainPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  chainText: { fontFamily: font.semibold, fontSize: 12 },
  arrow: { fontFamily: font.semibold, fontSize: 14 },
  step: { marginTop: 12 },
  stepIndex: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.3, textTransform: 'uppercase' },
  stepTitle: { fontFamily: font.semibold, fontSize: 17, marginTop: 3, marginBottom: 4 },
  stepBody: { fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  tip: { marginTop: 12 },
  link: { marginTop: 10 },
  actions: { marginTop: 18 },
});
