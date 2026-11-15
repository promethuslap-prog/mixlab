import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

import { dark, light, type Palette } from '@/theme/tokens';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  scheme: 'light' | 'dark';
  colors: Palette;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeValue | null>(null);
const STORAGE_KEY = 'mixlab.theme.v1';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') setModeState(stored);
      })
      .catch(() => {});
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  useEffect(() => {
    try {
      Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
    } catch {
      // Some web runtimes have no appearance override. The palette below still switches.
    }
  }, [mode]);

  const scheme = mode === 'system' ? (system === 'light' ? 'light' : 'dark') : mode;

  useEffect(() => {
    const background = scheme === 'light' ? light.bg : dark.bg;
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = background;
      document.documentElement.style.backgroundColor = background;
      document.documentElement.style.colorScheme = scheme;
    }
  }, [scheme]);
  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      setMode,
      scheme,
      colors: scheme === 'light' ? light : dark,
      isDark: scheme === 'dark',
    }),
    [mode, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
