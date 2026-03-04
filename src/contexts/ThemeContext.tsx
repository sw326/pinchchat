import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ThemeContext, type ThemeName, type AccentColor, type UiFont, type MonoFont } from './ThemeContextDef';

export type { ThemeName, AccentColor } from './ThemeContextDef';

const STORAGE_KEY = 'pinchchat-theme';

interface StoredTheme {
  theme: ThemeName;
  accent: AccentColor;
  uiFont: UiFont;
  monoFont: MonoFont;
  uiFontSize: number;
  monoFontSize: number;
}

type ConcreteTheme = 'dark' | 'light' | 'oled';
const themes: Record<ConcreteTheme, Record<string, string>> = {
  dark: {
    '--pc-bg-base': '#1e1e24',
    '--pc-bg-surface': '#232329',
    '--pc-bg-elevated': '#27272a',
    '--pc-bg-input': '#1a1a20',
    '--pc-bg-sidebar': 'rgba(30,30,36,0.95)',
    '--pc-bg-code': '#1a1a20',
    '--pc-border': 'rgba(255,255,255,0.08)',
    '--pc-border-strong': 'rgba(255,255,255,0.1)',
    '--pc-text-primary': '#d4d4d8',
    '--pc-text-secondary': '#a1a1aa',
    '--pc-text-muted': '#71717a',
    '--pc-text-faint': '#52525b',
    '--pc-scrollbar-thumb': '#52525b',
    '--pc-scrollbar-track': '#27272a',
    '--pc-scrollbar-thumb-hover': '#71717a',
    '--pc-hover': 'rgba(255,255,255,0.05)',
    '--pc-hover-strong': 'rgba(255,255,255,0.08)',
    '--pc-separator': 'rgba(255,255,255,0.05)',
  },
  light: {
    '--pc-bg-base': '#f4f4f5',
    '--pc-bg-surface': '#ffffff',
    '--pc-bg-elevated': '#e4e4e7',
    '--pc-bg-input': '#ffffff',
    '--pc-bg-sidebar': 'rgba(255,255,255,0.95)',
    '--pc-bg-code': '#f4f4f5',
    '--pc-border': 'rgba(0,0,0,0.08)',
    '--pc-border-strong': 'rgba(0,0,0,0.12)',
    '--pc-text-primary': '#18181b',
    '--pc-text-secondary': '#3f3f46',
    '--pc-text-muted': '#71717a',
    '--pc-text-faint': '#a1a1aa',
    '--pc-scrollbar-thumb': '#a1a1aa',
    '--pc-scrollbar-track': '#e4e4e7',
    '--pc-scrollbar-thumb-hover': '#71717a',
    '--pc-hover': 'rgba(0,0,0,0.05)',
    '--pc-hover-strong': 'rgba(0,0,0,0.08)',
    '--pc-separator': 'rgba(0,0,0,0.08)',
  },
  oled: {
    '--pc-bg-base': '#000000',
    '--pc-bg-surface': '#0a0a0a',
    '--pc-bg-elevated': '#141414',
    '--pc-bg-input': '#0a0a0a',
    '--pc-bg-sidebar': 'rgba(0,0,0,0.95)',
    '--pc-bg-code': '#0a0a0a',
    '--pc-border': 'rgba(255,255,255,0.06)',
    '--pc-border-strong': 'rgba(255,255,255,0.08)',
    '--pc-text-primary': '#d4d4d8',
    '--pc-text-secondary': '#a1a1aa',
    '--pc-text-muted': '#71717a',
    '--pc-text-faint': '#3f3f46',
    '--pc-scrollbar-thumb': '#3f3f46',
    '--pc-scrollbar-track': '#0a0a0a',
    '--pc-scrollbar-thumb-hover': '#52525b',
    '--pc-hover': 'rgba(255,255,255,0.04)',
    '--pc-hover-strong': 'rgba(255,255,255,0.06)',
    '--pc-separator': 'rgba(255,255,255,0.04)',
  },
};

const accents: Record<AccentColor, Record<string, string>> = {
  cyan: {
    '--pc-accent': '#22d3ee',
    '--pc-accent-light': '#67e8f9',
    '--pc-accent-dim': 'rgba(34,211,238,0.3)',
    '--pc-accent-glow': 'rgba(34,211,238,0.1)',
    '--pc-accent-rgb': '34,211,238',
  },
  violet: {
    '--pc-accent': '#8b5cf6',
    '--pc-accent-light': '#a78bfa',
    '--pc-accent-dim': 'rgba(139,92,246,0.3)',
    '--pc-accent-glow': 'rgba(139,92,246,0.1)',
    '--pc-accent-rgb': '139,92,246',
  },
  emerald: {
    '--pc-accent': '#10b981',
    '--pc-accent-light': '#34d399',
    '--pc-accent-dim': 'rgba(16,185,129,0.3)',
    '--pc-accent-glow': 'rgba(16,185,129,0.1)',
    '--pc-accent-rgb': '16,185,129',
  },
  amber: {
    '--pc-accent': '#f59e0b',
    '--pc-accent-light': '#fbbf24',
    '--pc-accent-dim': 'rgba(245,158,11,0.3)',
    '--pc-accent-glow': 'rgba(245,158,11,0.1)',
    '--pc-accent-rgb': '245,158,11',
  },
  rose: {
    '--pc-accent': '#f43f5e',
    '--pc-accent-light': '#fb7185',
    '--pc-accent-dim': 'rgba(244,63,94,0.3)',
    '--pc-accent-glow': 'rgba(244,63,94,0.1)',
    '--pc-accent-rgb': '244,63,94',
  },
  blue: {
    '--pc-accent': '#3b82f6',
    '--pc-accent-light': '#60a5fa',
    '--pc-accent-dim': 'rgba(59,130,246,0.3)',
    '--pc-accent-glow': 'rgba(59,130,246,0.1)',
    '--pc-accent-rgb': '59,130,246',
  },
};

const uiFonts: Record<UiFont, string> = {
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  inter: "'Inter', 'Segoe UI', system-ui, sans-serif",
  segoe: "'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif",
  sf: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
};

const monoFonts: Record<MonoFont, string> = {
  jetbrains: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fira: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  cascadia: "'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  'system-mono': "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

function applyVars(vars: Record<string, string>) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
}

/** Resolve 'system' to the actual theme based on OS preference. */
function resolveTheme(name: ThemeName): 'dark' | 'light' | 'oled' {
  if (name === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return name;
}

function loadStored(): StoredTheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const themeValid = parsed.theme in themes || parsed.theme === 'system';
      const accentValid = parsed.accent in accents;
      const uiFont: UiFont = uiFonts[parsed.uiFont as UiFont] ? parsed.uiFont : 'system';
      const monoFont: MonoFont = monoFonts[parsed.monoFont as MonoFont] ? parsed.monoFont : 'jetbrains';
      const uiFontSize = Number.isFinite(parsed.uiFontSize) ? Math.min(20, Math.max(12, Number(parsed.uiFontSize))) : 15;
      const monoFontSize = Number.isFinite(parsed.monoFontSize) ? Math.min(20, Math.max(12, Number(parsed.monoFontSize))) : 14;
      if (themeValid && accentValid) {
        return {
          theme: parsed.theme,
          accent: parsed.accent,
          uiFont,
          monoFont,
          uiFontSize,
          monoFontSize,
        };
      }
    }
  } catch { /* ignore invalid stored JSON */ }
  return { theme: 'dark', accent: 'cyan', uiFont: 'system', monoFont: 'jetbrains', uiFontSize: 15, monoFontSize: 14 };
}

function fontVars(uiFont: UiFont, monoFont: MonoFont, uiFontSize: number, monoFontSize: number) {
  return {
    '--pc-font-ui': uiFonts[uiFont],
    '--pc-font-mono': monoFonts[monoFont],
    '--pc-font-size': `${uiFontSize}px`,
    '--pc-font-size-mono': `${monoFontSize}px`,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(loadStored);
  const [theme, setThemeState] = useState<ThemeName>(stored.theme);
  const [accent, setAccentState] = useState<AccentColor>(stored.accent);
  const [uiFont, setUiFontState] = useState<UiFont>(stored.uiFont);
  const [monoFont, setMonoFontState] = useState<MonoFont>(stored.monoFont);
  const [uiFontSize, setUiFontSizeState] = useState<number>(stored.uiFontSize);
  const [monoFontSize, setMonoFontSizeState] = useState<number>(stored.monoFontSize);

  const persist = useCallback((t: ThemeName, a: AccentColor, ui: UiFont, mono: MonoFont, uiSize: number, monoSize: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme: t,
      accent: a,
      uiFont: ui,
      monoFont: mono,
      uiFontSize: uiSize,
      monoFontSize: monoSize,
    }));
  }, []);

  const applyAll = useCallback((nextTheme: ThemeName, nextAccent: AccentColor, nextUiFont: UiFont, nextMonoFont: MonoFont, nextUiSize: number, nextMonoSize: number) => {
    applyVars({
      ...themes[resolveTheme(nextTheme)],
      ...accents[nextAccent],
      ...fontVars(nextUiFont, nextMonoFont, nextUiSize, nextMonoSize),
    });
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    applyAll(t, accent, uiFont, monoFont, uiFontSize, monoFontSize);
    persist(t, accent, uiFont, monoFont, uiFontSize, monoFontSize);
  }, [accent, applyAll, persist, uiFont, monoFont, uiFontSize, monoFontSize]);

  const setAccent = useCallback((a: AccentColor) => {
    setAccentState(a);
    applyAll(theme, a, uiFont, monoFont, uiFontSize, monoFontSize);
    persist(theme, a, uiFont, monoFont, uiFontSize, monoFontSize);
  }, [theme, applyAll, persist, uiFont, monoFont, uiFontSize, monoFontSize]);

  const setUiFont = useCallback((f: UiFont) => {
    setUiFontState(f);
    applyAll(theme, accent, f, monoFont, uiFontSize, monoFontSize);
    persist(theme, accent, f, monoFont, uiFontSize, monoFontSize);
  }, [accent, theme, applyAll, persist, monoFont, uiFontSize, monoFontSize]);

  const setMonoFont = useCallback((f: MonoFont) => {
    setMonoFontState(f);
    applyAll(theme, accent, uiFont, f, uiFontSize, monoFontSize);
    persist(theme, accent, uiFont, f, uiFontSize, monoFontSize);
  }, [accent, theme, applyAll, persist, uiFont, uiFontSize, monoFontSize]);

  const setUiFontSize = useCallback((size: number) => {
    const clamped = Math.min(20, Math.max(12, size));
    setUiFontSizeState(clamped);
    applyAll(theme, accent, uiFont, monoFont, clamped, monoFontSize);
    persist(theme, accent, uiFont, monoFont, clamped, monoFontSize);
  }, [accent, theme, applyAll, persist, uiFont, monoFont, monoFontSize]);

  const setMonoFontSize = useCallback((size: number) => {
    const clamped = Math.min(20, Math.max(12, size));
    setMonoFontSizeState(clamped);
    applyAll(theme, accent, uiFont, monoFont, uiFontSize, clamped);
    persist(theme, accent, uiFont, monoFont, uiFontSize, clamped);
  }, [accent, theme, applyAll, persist, uiFont, monoFont, uiFontSize]);

  // Apply on mount
  useEffect(() => {
    applyAll(theme, accent, uiFont, monoFont, uiFontSize, monoFontSize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to OS color scheme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => applyAll(mq.matches ? 'light' : 'dark', accent, uiFont, monoFont, uiFontSize, monoFontSize);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, accent, applyAll, uiFont, monoFont, uiFontSize, monoFontSize]);

  const resolvedTheme = resolveTheme(theme);

  return (
    <ThemeContext.Provider value={{
      theme,
      accent,
      uiFont,
      monoFont,
      uiFontSize,
      monoFontSize,
      resolvedTheme,
      setTheme,
      setAccent,
      setUiFont,
      setMonoFont,
      setUiFontSize,
      setMonoFontSize,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
