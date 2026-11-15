export type LessonStep = {
  title: string;
  body: string;
};

export type LessonLink = {
  label: string;
  href: '/mixer' | '/eq';
  preset?: 'problem';
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  steps: LessonStep[];
  tip: string;
  signal?: string[];
  delayCalculator?: boolean;
  links?: LessonLink[];
};

export type Track = {
  id: 'basics' | 'live' | 'studio';
  title: string;
  eyebrow: string;
  summary: string;
  color: string;
  lessons: Lesson[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  why: string;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  aka?: string;
  definition: string;
  why: string;
};
