import { createContext } from 'react';

export type ThemeName = 'dark' | 'light' | 'oled' | 'system';
export type AccentColor = 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'blue';
export type UiFont = 'system' | 'inter' | 'segoe' | 'sf';
export type MonoFont = 'jetbrains' | 'fira' | 'cascadia' | 'system-mono';

export interface ThemeContextValue {
  theme: ThemeName;
  accent: AccentColor;
  uiFont: UiFont;
  monoFont: MonoFont;
  uiFontSize: number;
  monoFontSize: number;
  /** Resolved concrete theme (never 'system'). */
  resolvedTheme: 'dark' | 'light' | 'oled';
  setTheme: (t: ThemeName) => void;
  setAccent: (a: AccentColor) => void;
  setUiFont: (f: UiFont) => void;
  setMonoFont: (f: MonoFont) => void;
  setUiFontSize: (size: number) => void;
  setMonoFontSize: (size: number) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  accent: 'cyan',
  uiFont: 'system',
  monoFont: 'jetbrains',
  uiFontSize: 15,
  monoFontSize: 14,
  resolvedTheme: 'dark',
  setTheme: () => {},
  setAccent: () => {},
  setUiFont: () => {},
  setMonoFont: () => {},
  setUiFontSize: () => {},
  setMonoFontSize: () => {},
});
