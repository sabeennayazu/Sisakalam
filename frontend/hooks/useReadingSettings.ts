import { useState, useEffect, useCallback } from 'react';

export type BackgroundColor = 'default' | 'sepia' | 'dark' | 'eye-comfort';
export type FontFamily = 'serif' | 'sans-serif' | 'dyslexic';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface ReadingSettings {
  backgroundColor: BackgroundColor;
  fontFamily: FontFamily;
  fontSize: FontSize;
}

interface UseReadingSettingsReturn extends ReadingSettings {
  updateSettings: (updates: Partial<ReadingSettings>) => void;
  resetSettings: () => void;
  getCSSVars: () => Record<string, string>;
  getBackgroundClass: () => string;
}

const DEFAULT_SETTINGS: ReadingSettings = {
  backgroundColor: 'default',
  fontFamily: 'serif',
  fontSize: 'medium',
};

const STORAGE_KEY = 'reading-settings';

/**
 * Custom hook for managing reader settings with localStorage persistence.
 */
export function useReadingSettings(): UseReadingSettingsReturn {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ReadingSettings;
        setSettings(parsed);
      }
    } catch (err) {
      console.error('Failed to load reading settings:', err);
    }
    setIsHydrated(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save reading settings:', err);
    }
  }, [settings, isHydrated]);

  const updateSettings = useCallback((updates: Partial<ReadingSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const getCSSVars = useCallback((): Record<string, string> => {
    const fontFamilyMap: Record<FontFamily, string> = {
      serif: 'Georgia, serif',
      'sans-serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      dyslexic:
        '"OpenDyslexic", "Comic Sans MS", cursive, sans-serif',
    };

    const fontSizeMap: Record<FontSize, string> = {
      small: '14px',
      medium: '18px',
      large: '20px',
      'extra-large': '24px',
    };

    return {
      '--reading-font-family': fontFamilyMap[settings.fontFamily],
      '--reading-font-size': fontSizeMap[settings.fontSize],
    };
  }, [settings.fontFamily, settings.fontSize]);

  const getBackgroundClass = useCallback((): string => {
    const classMap: Record<BackgroundColor, string> = {
      default: 'bg-white text-gray-900',
      sepia: 'bg-amber-50 text-amber-900',
      dark: 'bg-gray-900 text-gray-100',
      'eye-comfort': 'bg-green-50 text-gray-800',
    };
    return classMap[settings.backgroundColor];
  }, [settings.backgroundColor]);

  return {
    ...settings,
    updateSettings,
    resetSettings,
    getCSSVars,
    getBackgroundClass,
  };
}
