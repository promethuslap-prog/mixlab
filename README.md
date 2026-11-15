# Mix Lab

Mix Lab is a phone app that teaches beginners (about 13–18) how to mix audio for live shows and studio sessions. Lessons are short and in plain language. A six-channel mixer actually plays sound, with faders, pan, mute, solo, and 3-band EQ that change what you hear.

It is an [Expo](https://expo.dev) app (React Native + TypeScript), so the same project runs on iPhone and Android in Expo Go, and can later be built for the App Store and Play Store with EAS.

## Try it on a phone

1. Install **Expo Go** from the App Store or Play Store. This project uses Expo SDK 58, so update Expo Go if it is already installed.
2. On a computer, in this folder:

   ```bash
   npm install
   npx expo start
   ```

3. Phone and computer need the same Wi‑Fi. Scan the QR code with the iPhone camera or with Expo Go on Android.
4. Use headphones. Phone speakers hide the lowest octave, which makes kick and bass hard to judge.

`npx expo start --web` also opens the app in a desktop browser. The screens and the audio engine are the same ones the phone uses.

## What’s inside

- **Basics, Live sound, and Studio.** Each lesson is a few short steps plus a tip. Basics covers signal flow, gain staging, decibels, EQ ranges, compression, panning, reverb and delay (including delay time from tempo), and ear training. Live covers soundcheck order, FOH versus monitors, feedback, mic placement, DI boxes, stage volume, and a show-day checklist. Studio covers the DAW, recording levels, mic placement, MIDI from keys and e-drums, editing, building a mix, and loudness / export.
- **Progress** is stored on the phone with AsyncStorage: lesson checkmarks and best quiz score per track.
- **Quizzes.** Eight multiple-choice questions per track, with an explanation as soon as you answer.
- **Glossary.** Forty-plus mixing terms, searchable.
- **EQ explorer.** A log slider from 20 Hz to 20 kHz. It describes what that band sounds like, what usually goes wrong, a fix, and which instruments live there. It can play a filtered noise band or a sine tone.
- **Mixer.** Lead vocal, guitar, keys, kick, snare (with a light hi-hat), and bass. Per channel: fader, pan, mute, solo, and low / mid / high EQ. Master fader, a level meter, and a clip light. Presets: a decent starting mix, a problem mix to fix, and a flat mix. Short notes call out a buried vocal, too much low end, harsh highs, lopsided pan, and clipping.

The parts are synthesized in the app. There are no sampled recordings and nothing taken from a commercial song.

## How the audio works

On iPhone and Android, Expo Go cannot load custom native modules. `react-native-audio-api` has real biquad filters, but it is not part of Expo Go and needs a dev build.

Mix Lab uses the **Web Audio API** instead, which both phone webviews already have:

- Each channel is a looping buffer (the synthesized stem) through a low shelf at 120 Hz, a peaking filter at 1 kHz, a high shelf at 8 kHz, a stereo pan, and a gain.
- The master feeds an analyser (the meter and clip light), then a safety trim and a soft clipper so a bad mix can light CLIP without blasting the speaker at full digital clip.
- Mute, solo, and the faders are the same gain nodes. Solo overrides non-soloed channels. Mute wins over solo.

On a phone this graph runs inside a hidden `react-native-webview`, because that is available in Expo Go. The first time you press play, the phone asks for one tap. Mobile webviews refuse to start audio until a gesture happens inside the view. After that, play, stop, and every fader move go through for the rest of the session.

In the browser (`npx expo start --web`) the same engine runs directly in the page, with no webview.

Tradeoff versus a native audio graph: a little startup time while the loop is rendered, and that first unlock tap. It is not low-latency enough to sing through. For a mixing lesson it is the right fit, because the EQ, pan, and levels you move are the ones you hear, on both platforms, without leaving Expo Go. A later EAS dev build could swap in `react-native-audio-api` without rewriting the lessons. The node graph is the same idea.

`expo-audio` is only used to set the iOS audio session so playback is allowed while the ringer is muted. The app does not record, and it does not ask for the microphone.

## Build for the stores with EAS

You need an Expo account, and then an Apple Developer account for the App Store and a Google Play Console account for Play.

```bash
npm install -g eas-cli
eas login
eas init
```

`eas init` writes the EAS project id into the app config. The bundle id is `com.mixlab.app` (iOS and Android). Change it in `app.json` before you ship if you do not own that id.

```bash
eas build -p android --profile preview
eas build -p ios --profile production
eas build -p android --profile production
```

`preview` makes an Android APK you can install without the store. `production` makes the store binaries (AAB on Android, IPA on iOS).

Submit after a production build:

```bash
eas submit -p ios --profile production
eas submit -p android --profile production
```

`eas.json` has `development`, `preview`, and `production` profiles. A development build is only needed if you later add a native module that Expo Go does not include.

## Scripts

```bash
npm run typecheck   # tsc --noEmit
npm run check       # stem levels, delay math, mix notes, lesson and quiz shape
npm run start
```

## Project layout

- `app/` — screens (Expo Router): home, learn, mixer, EQ explorer, glossary, lessons, quizzes, progress
- `src/content/` — lessons, quizzes, glossary, EQ band guide
- `src/audio/engine.js` — synthesizer and Web Audio graph (the source of truth)
- `src/audio/engineSource.ts` — that file inlined for the webview (`npm run sync-engine` regenerates it)
- `src/lib/mixFeedback.ts` — the plain-language mix notes

## Limits

- The “band” is synthesized: a formant melody, muted Karplus-Strong chords, an electric-piano-style chord stab, a kick, a snare with a hat, and a bass with a sub plus harmonics so a phone can still hear it. It is for practice, not a record.
- The channel EQ is three bands, not a fully parametric console.
- Portrait layout. Progress never leaves the device.
- Streaming loudness in the lessons is the usual teaching target: many services adjust toward about −14 LUFS integrated, and Apple Music sits nearer −16. Those targets move; the idea that does not move is that louder is not the same as better.
