import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode, type Ref } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import WebViewImpl, { type WebViewMessageEvent, type WebViewProps } from 'react-native-webview';

type WebViewHandle = { injectJavaScript: (script: string) => void };
const WebView = WebViewImpl as unknown as ComponentType<WebViewProps & { ref?: Ref<WebViewHandle> }>;

import { mixerHtml } from '@/audio/mixerHtml';
import type { EqListenMode, MeterReading, MixGraphState } from '@/audio/types';
import { ENGINE_JS } from '@/audio/engineSource';
import { useTheme } from '@/theme/ThemeProvider';

type EngineEvent =
  | { type: 'ready' }
  | { type: 'unlocked' }
  | { type: 'cancelled' }
  | { type: 'status'; busy: boolean; playing: boolean; mode?: string }
  | { type: 'error'; message: string }
  | { type: 'meter'; db: number; peak: number; clipping: boolean; state?: string };

type EngineApi = {
  unlock: () => void;
  startMixer: (state: MixGraphState) => void;
  setMix: (state: MixGraphState) => void;
  startEq: (freq: number, mode: EqListenMode, volume: number) => void;
  stop: () => void;
  sampleMeter: () => MeterReading;
};

type Action =
  | { type: 'mixer'; state: MixGraphState }
  | { type: 'mix'; state: MixGraphState }
  | { type: 'eq'; freq: number; mode: EqListenMode; volume: number }
  | { type: 'stop' };

type AudioValue = {
  unlocked: boolean;
  playing: boolean;
  busy: boolean;
  error: string | null;
  meter: MeterReading;
  playMixer: (state: MixGraphState) => void;
  updateMix: (state: MixGraphState) => void;
  playEq: (freq: number, mode: EqListenMode, volume: number) => void;
  stop: () => void;
};

const SILENT: MeterReading = { db: -96, peak: 0, clipping: false };
const AudioContext = createContext<AudioValue | null>(null);

type WebWindow = Window & {
  MixLabEngine?: { create: (post: (msg: EngineEvent) => void) => EngineApi };
  __mixlab?: EngineApi;
  __mixlabHandler?: (msg: EngineEvent) => void;
};

function webEngine(): EngineApi {
  const w = window as WebWindow;
  if (!w.__mixlab) {
    const script = document.createElement('script');
    script.textContent = ENGINE_JS;
    document.head.appendChild(script);
    if (!w.MixLabEngine) throw new Error('Audio engine failed to load.');
    w.__mixlab = w.MixLabEngine.create((msg) => w.__mixlabHandler?.(msg));
  }
  return w.__mixlab;
}

export function AudioEngineProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const webRef = useRef<WebViewHandle>(null);
  const [webReady, setWebReady] = useState(Platform.OS === 'web');
  const [unlocked, setUnlocked] = useState(Platform.OS === 'web');
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meter, setMeter] = useState<MeterReading>(SILENT);
  const [sheet, setSheet] = useState(false);
  const queue = useRef<object[]>([]);
  const playingRef = useRef(false);

  const flush = useCallback(() => {
    const view = webRef.current;
    if (!view) return;
    const pending = queue.current.splice(0);
    for (const msg of pending) {
      view.injectJavaScript(`window.__mixlabReceive(${JSON.stringify(msg)}); true;`);
    }
  }, []);

  const send = useCallback(
    (msg: object) => {
      if (Platform.OS === 'web') return;
      if (!webReady || !webRef.current) {
        queue.current.push(msg);
        return;
      }
      webRef.current.injectJavaScript(`window.__mixlabReceive(${JSON.stringify(msg)}); true;`);
    },
    [webReady],
  );

  const onEngineEvent = useCallback((msg: EngineEvent) => {
    if (msg.type === 'ready') return;
    if (msg.type === 'unlocked') {
      setUnlocked(true);
      setSheet(false);
      return;
    }
    if (msg.type === 'cancelled') {
      setSheet(false);
      setBusy(false);
      return;
    }
    if (msg.type === 'error') {
      setError(msg.message);
      setBusy(false);
      setPlaying(false);
      playingRef.current = false;
      return;
    }
    if (msg.type === 'status') {
      setBusy(msg.busy);
      setPlaying(msg.playing);
      playingRef.current = msg.playing;
      if (!msg.playing) setMeter(SILENT);
      if (msg.playing) setError(null);
      return;
    }
    if (msg.type === 'meter') {
      setMeter({ db: msg.db, peak: msg.peak, clipping: msg.clipping, state: msg.state });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    (window as WebWindow).__mixlabHandler = onEngineEvent;
  }, [onEngineEvent]);

  useEffect(() => {
    if (webReady) flush();
  }, [webReady, flush]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const id = setInterval(() => {
      if (!playingRef.current) return;
      try {
        const next = webEngine().sampleMeter();
        setMeter(next);
      } catch {
        // The meter can miss a frame while the context is starting.
      }
    }, 80);
    return () => clearInterval(id);
  }, []);

  const themePayload = useMemo(
    () => ({
      overlay: colors.overlay,
      surface: colors.surface,
      text: colors.text,
      muted: colors.muted,
      accent: colors.accent,
      onAccent: colors.onAccent,
    }),
    [colors],
  );

  const stageOrRun = useCallback(
    (action: Action) => {
      setError(null);
      if (Platform.OS === 'web') {
        const engine = webEngine();
        engine.unlock();
        if (action.type === 'mixer') engine.startMixer(action.state);
        else if (action.type === 'eq') engine.startEq(action.freq, action.mode, action.volume);
        else if (action.type === 'mix') engine.setMix(action.state);
        else engine.stop();
        return;
      }
      if (!unlocked && (action.type === 'mixer' || action.type === 'eq')) {
        setSheet(true);
        send({ cmd: 'stage', action, theme: themePayload });
        return;
      }
      send({ cmd: 'exec', action });
    },
    [send, themePayload, unlocked],
  );

  const value = useMemo<AudioValue>(
    () => ({
      unlocked,
      playing,
      busy,
      error,
      meter,
      playMixer: (state) => stageOrRun({ type: 'mixer', state }),
      updateMix: (state) => {
        if (!playingRef.current) return;
        if (Platform.OS === 'web') {
          try {
            webEngine().setMix(state);
          } catch {
            // Ignore a drag that lands before the graph exists.
          }
          return;
        }
        send({ cmd: 'exec', action: { type: 'mix', state } });
      },
      playEq: (freq, mode, volume) => stageOrRun({ type: 'eq', freq, mode, volume }),
      stop: () => {
        playingRef.current = false;
        setPlaying(false);
        setBusy(false);
        setMeter(SILENT);
        if (Platform.OS === 'web') {
          try {
            webEngine().stop();
          } catch {
            // Already stopped.
          }
          return;
        }
        send({ cmd: 'exec', action: { type: 'stop' } });
      },
    }),
    [busy, error, meter, playing, send, stageOrRun, unlocked],
  );

  const html = useMemo(() => (Platform.OS === 'web' ? '' : mixerHtml()), []);

  return (
    <AudioContext.Provider value={value}>
      <View style={styles.fill}>
        {children}
        {Platform.OS !== 'web' ? (
          <WebView
            ref={webRef}
            source={{ html }}
            originWhitelist={['*']}
            onLoadEnd={() => setWebReady(true)}
            onMessage={(event: WebViewMessageEvent) => {
              try {
                onEngineEvent(JSON.parse(event.nativeEvent.data) as EngineEvent);
              } catch {
                setError('The audio engine sent a message the app could not read.');
              }
            }}
            style={sheet ? styles.sheet : styles.hidden}
            pointerEvents={sheet ? 'auto' : 'none'}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
            javaScriptEnabled
            domStorageEnabled
            androidLayerType="hardware"
            setSupportMultipleWindows={false}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          />
        ) : null}
      </View>
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const value = useContext(AudioContext);
  if (!value) throw new Error('useAudio must be used inside AudioEngineProvider');
  return value;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sheet: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'transparent', zIndex: 20 },
  hidden: { position: 'absolute', width: 320, height: 480, top: -2400, left: 0, opacity: 0 },
});
