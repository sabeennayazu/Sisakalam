'use client';

import { Settings } from 'lucide-react';
import {
  ReadingSettings,
  BackgroundColor,
  FontFamily,
  FontSize,
  useReadingSettings,
} from '@/hooks/useReadingSettings';

interface ReaderSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const BACKGROUND_OPTIONS: { label: string; value: BackgroundColor }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Sepia', value: 'sepia' },
  { label: 'Dark', value: 'dark' },
  { label: 'Eye Comfort', value: 'eye-comfort' },
];

const FONT_FAMILY_OPTIONS: { label: string; value: FontFamily }[] = [
  { label: 'Serif', value: 'serif' },
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'Dyslexic-friendly', value: 'dyslexic' },
];

const FONT_SIZE_OPTIONS: { label: string; value: FontSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'extra-large' },
];

export default function ReaderSettingsPanel({
  isOpen,
  onClose,
}: ReaderSettingsPanelProps) {
  const {
    backgroundColor,
    fontFamily,
    fontSize,
    updateSettings,
    resetSettings,
  } = useReadingSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-screen w-80 overflow-y-auto bg-white shadow-lg">
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="text-lg font-bold text-gray-900">Settings</h2>
            </div>
            <button
              onClick={resetSettings}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          {/* Background Color */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">
              Background Color
            </h3>
            <div className="space-y-2">
              {BACKGROUND_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateSettings({ backgroundColor: option.value })
                  }
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                    backgroundColor === option.value
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Font Family</h3>
            <div className="space-y-2">
              {FONT_FAMILY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ fontFamily: option.value })}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                    fontFamily === option.value
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    fontFamily:
                      option.value === 'serif'
                        ? 'Georgia, serif'
                        : option.value === 'dyslexic'
                          ? '"OpenDyslexic", cursive'
                          : 'sans-serif',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Font Size</h3>
            <div className="space-y-2">
              {FONT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ fontSize: option.value })}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                    fontSize === option.value
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    fontSize:
                      option.value === 'small'
                        ? '14px'
                        : option.value === 'medium'
                          ? '16px'
                          : option.value === 'large'
                            ? '18px'
                            : '20px',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
