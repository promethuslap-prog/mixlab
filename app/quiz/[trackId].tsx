import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Muted, ProgressBar, Screen, TopBar } from '@/components/ui';
import { findTrack } from '@/content/lessons';
import { quizFor } from '@/content/quizzes';
import { useProgress } from '@/storage/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function QuizScreen() {
  const { trackId } = useLocalSearchParams<{ trackId: string }>();
  const track = findTrack(String(trackId));
  const questions = quizFor(String(trackId));
  const { colors } = useTheme();
  const progress = useProgress();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!track || !questions) {
    return (
      <Screen>
        <TopBar back title="Quiz" />
        <View style={styles.pad}>
          <Text style={[styles.prompt, { color: colors.text }]}>That quiz is not in Mix Lab.</Text>
        </View>
      </Screen>
    );
  }

  if (finished) {
    const total = questions.length;
    const ratio = correctCount / total;
    const line =
      ratio === 1
        ? 'You can explain this track out loud.'
        : ratio >= 0.75
          ? 'Solid. Review the ones you missed and you have it.'
          : ratio >= 0.5
            ? 'Halfway there. Replay the lessons that felt fuzzy, then try again.'
            : 'Start the lesson track again. The questions will still be here.';
    return (
      <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
        <TopBar back title={`${track.title} quiz`} />
        <Text style={[styles.score, { color: colors.text }]}>
          {correctCount} of {total}
        </Text>
        <Muted style={styles.summary}>{line}</Muted>
        <View style={styles.bar}>
          <ProgressBar fraction={ratio} color={track.color} />
        </View>
        <Muted>Best score saved on this phone: {progress.quizzes[track.id]?.correct ?? correctCount} of {total}.</Muted>
        <View style={styles.actions}>
          <Button
            label="Back to lessons"
            onPress={() => router.replace({ pathname: '/track/[trackId]', params: { trackId: track.id } })}
          />
          <View style={styles.gap}>
            <Button
              label="Try again"
              tone="ghost"
              onPress={() => {
                setIndex(0);
                setPicked(null);
                setCorrectCount(0);
                setFinished(false);
              }}
            />
          </View>
        </View>
      </Screen>
    );
  }

  const question = questions[index];
  const answered = picked != null;

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <TopBar back title={`${track.title} quiz`} />
      <Text style={[styles.count, { color: colors.muted }]}>
        Question {index + 1} of {questions.length}
      </Text>
      <View style={styles.bar}>
        <ProgressBar fraction={index / questions.length} color={track.color} />
      </View>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>
      {question.choices.map((choice, choiceIndex) => {
        const selected = picked === choiceIndex;
        const isAnswer = choiceIndex === question.answer;
        let border = colors.border;
        let background = colors.surface;
        if (answered && isAnswer) {
          border = colors.good;
          background = colors.goodSoft;
        } else if (answered && selected && !isAnswer) {
          border = colors.danger;
          background = colors.dangerSoft;
        }
        return (
          <Pressable
            key={choice}
            accessibilityRole="button"
            disabled={answered}
            onPress={() => {
              setPicked(choiceIndex);
              const right = choiceIndex === question.answer;
              if (right) setCorrectCount((count) => count + 1);
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(
                  right ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
                ).catch(() => {});
              }
            }}
            style={[styles.choice, { borderColor: border, backgroundColor: background }]}
          >
            <Text style={[styles.choiceText, { color: colors.text }]}>{choice}</Text>
          </Pressable>
        );
      })}
      {answered ? (
        <Card style={styles.why}>
          <Text style={[styles.whyTitle, { color: picked === question.answer ? colors.good : colors.danger }]}>
            {picked === question.answer ? 'Correct' : 'Not quite'}
          </Text>
          <Text style={[styles.whyBody, { color: colors.text }]}>{question.why}</Text>
          <View style={styles.next}>
            <Button
              label={index === questions.length - 1 ? 'See score' : 'Next question'}
              onPress={() => {
                if (index === questions.length - 1) {
                  progress.saveQuiz(track.id, correctCount, questions.length);
                  setFinished(true);
                  return;
                }
                setIndex((value) => value + 1);
                setPicked(null);
              }}
            />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20 },
  count: { fontFamily: font.semibold, fontSize: 13, marginTop: 8 },
  bar: { marginTop: 8, marginBottom: 16 },
  prompt: { fontFamily: font.bold, fontSize: 22, letterSpacing: -0.3, lineHeight: 28, marginBottom: 14 },
  choice: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 8 },
  choiceText: { fontFamily: font.medium, fontSize: 15, lineHeight: 21 },
  why: { marginTop: 8 },
  whyTitle: { fontFamily: font.semibold, fontSize: 14, marginBottom: 4 },
  whyBody: { fontFamily: font.regular, fontSize: 15, lineHeight: 21 },
  next: { marginTop: 12 },
  score: { fontFamily: font.bold, fontSize: 48, letterSpacing: -1, marginTop: 12 },
  summary: { marginTop: 6 },
  actions: { marginTop: 20 },
  gap: { marginTop: 10 },
});
