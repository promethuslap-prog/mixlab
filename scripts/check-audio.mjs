import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve('src');
const cache = new Map();

function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return null;
  const base = spec.startsWith('@/')
    ? path.join(root, spec.slice(2))
    : path.resolve(path.dirname(fromFile), spec);
  if (fs.existsSync(`${base}.ts`)) return `${base}.ts`;
  if (fs.existsSync(`${base}.tsx`)) return `${base}.tsx`;
  return base;
}

function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const source = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  cache.set(file, module);
  const localRequire = (spec) => {
    const resolved = resolveImport(file, spec);
    if (!resolved) throw new Error(`Unexpected import ${spec} from ${file}`);
    return load(resolved);
  };
  const fn = new Function('exports', 'require', 'module', js);
  fn(module.exports, localRequire, module);
  return module.exports;
}

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exitCode = 1;
  }
}

const engineSrc = fs.readFileSync('src/audio/engine.js', 'utf8');
eval(engineSrc);
const stems = globalThis.MixLabEngine.renderStems(44100);
assert(Math.abs(stems.vocal.length / 44100 - 10) < 0.001, 'loop should be 10 seconds at 96 BPM');
assert(globalThis.MixLabEngine.BPM === 96, 'engine BPM');

for (const id of ['vocal', 'guitar', 'keys', 'kick', 'snare', 'bass']) {
  const buf = stems[id];
  let peak = 0;
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    assert(Number.isFinite(buf[i]), `${id} sample ${i} is not finite`);
    peak = Math.max(peak, Math.abs(buf[i]));
    sum += buf[i] * buf[i];
  }
  const rms = Math.sqrt(sum / buf.length);
  console.log(`${id} peak ${peak.toFixed(3)} rms ${rms.toFixed(4)}`);
  assert(peak > 0.12 && peak <= 0.85, `${id} peak ${peak} out of range`);
  assert(rms > 0.03 && rms < 0.12, `${id} rms ${rms} out of range`);
}

const { delayTimes } = load(path.join(root, 'lib/delayMath.ts'));
const at120 = delayTimes(120);
assert(Math.round(at120.quarter) === 500, '120 BPM quarter note is 500 ms');
assert(Math.round(at120.eighth) === 250, 'eighth note');
assert(Math.round(at120.dottedEighth) === 375, 'dotted eighth');
assert(Math.abs(at120.quarterTriplet - 1000 / 3) < 0.01, 'quarter triplet is 2/3 of a quarter note');

const { PRESETS } = load(path.join(root, 'audio/presets.ts'));
const { analyzeMix, likelyClipping } = load(path.join(root, 'lib/mixFeedback.ts'));
const goodNotes = analyzeMix(PRESETS.good, false).map((note) => note.id);
const problemNotes = analyzeMix(PRESETS.problem, likelyClipping(PRESETS.problem)).map((note) => note.id);
const flatNotes = analyzeMix(PRESETS.flat, false).map((note) => note.id);
console.log('good', goodNotes, 'problem', problemNotes, 'flat', flatNotes, 'problem clips', likelyClipping(PRESETS.problem));
assert(goodNotes.includes('good'), 'starting preset should read as a solid mix');
assert(!likelyClipping(PRESETS.good), 'starting preset should not clip');
assert(!likelyClipping(PRESETS.flat), 'flat preset should not clip on the heuristic');
assert(likelyClipping(PRESETS.problem), 'problem preset should look like it will clip');
assert(problemNotes.includes('clip') || problemNotes.includes('buried'), 'problem preset should flag a real issue');
assert(flatNotes.includes('flat'), 'flat preset should say the mix is still stacked');

const { tracks } = load(path.join(root, 'content/lessons.ts'));
const { quizzes } = load(path.join(root, 'content/quizzes.ts'));
const { glossary } = load(path.join(root, 'content/glossary.ts'));
const { describeFrequency } = load(path.join(root, 'content/eqGuide.ts'));
assert(tracks.length === 3, 'three tracks');
for (const track of tracks) {
  assert(track.lessons.length >= 6, `${track.id} needs lessons`);
  assert(quizzes[track.id].length >= 6, `${track.id} quiz length`);
  for (const lesson of track.lessons) {
    assert(lesson.steps.length >= 3 && lesson.tip.length > 20, `${lesson.id} is thin`);
  }
  for (const question of quizzes[track.id]) {
    assert(question.choices.length === 4, `${question.id} choices`);
    assert(question.answer >= 0 && question.answer <= 3, `${question.id} answer`);
    assert(question.why.length > 20, `${question.id} explanation`);
  }
}
assert(glossary.length >= 35, `glossary has ${glossary.length}`);
assert(describeFrequency(40).id === 'sub', '40 Hz is sub');
assert(describeFrequency(300).id === 'mud', '300 Hz is mud');
assert(describeFrequency(3000).id === 'presence', '3 kHz is presence');
assert(describeFrequency(15000).id === 'air', '15 kHz is air');

if (process.exitCode) {
  console.error('checks failed');
} else {
  console.log(`checks ok · ${tracks.reduce((n, t) => n + t.lessons.length, 0)} lessons · ${glossary.length} terms`);
}
