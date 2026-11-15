import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { lessonKey, tracks } from '@/content/lessons';

type QuizScore = { correct: number; total: number; at: number };

type Data = {
  completed: Record<string, number>;
  quizzes: Record<string, QuizScore>;
};

type ProgressValue = {
  ready: boolean;
  completed: Record<string, number>;
  quizzes: Record<string, QuizScore>;
  isComplete: (trackId: string, lessonId: string) => boolean;
  markComplete: (trackId: string, lessonId: string) => void;
  saveQuiz: (trackId: string, correct: number, total: number) => void;
  reset: () => void;
  trackStats: (trackId: string) => { done: number; total: number; fraction: number; quiz?: QuizScore };
  overall: { done: number; total: number; fraction: number };
};

const ProgressContext = createContext<ProgressValue | null>(null);
const STORAGE_KEY = 'mixlab.progress.v1';
const EMPTY: Data = { completed: {}, quizzes: {} };

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<Data>;
        setData({
          completed: parsed.completed ?? {},
          quizzes: parsed.quizzes ?? {},
        });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  const value = useMemo<ProgressValue>(() => {
    const totalLessons = tracks.reduce((sum, track) => sum + track.lessons.length, 0);
    const done = Object.keys(data.completed).length;
    return {
      ready,
      completed: data.completed,
      quizzes: data.quizzes,
      isComplete: (trackId, lessonId) => data.completed[lessonKey(trackId, lessonId)] != null,
      markComplete: (trackId, lessonId) => {
        const key = lessonKey(trackId, lessonId);
        setData((prev) => {
          if (prev.completed[key]) return prev;
          return { ...prev, completed: { ...prev.completed, [key]: Date.now() } };
        });
      },
      saveQuiz: (trackId, correct, total) => {
        setData((prev) => {
          const old = prev.quizzes[trackId];
          if (old && correct < old.correct) return prev;
          return {
            ...prev,
            quizzes: { ...prev.quizzes, [trackId]: { correct, total, at: Date.now() } },
          };
        });
      },
      reset: () => setData(EMPTY),
      trackStats: (trackId) => {
        const track = tracks.find((item) => item.id === trackId);
        const total = track?.lessons.length ?? 0;
        const trackDone = track?.lessons.filter((lesson) => data.completed[lessonKey(trackId, lesson.id)]).length ?? 0;
        return {
          done: trackDone,
          total,
          fraction: total === 0 ? 0 : trackDone / total,
          quiz: data.quizzes[trackId],
        };
      },
      overall: {
        done,
        total: totalLessons,
        fraction: totalLessons === 0 ? 0 : done / totalLessons,
      },
    };
  }, [data, ready]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used inside ProgressProvider');
  return value;
}
