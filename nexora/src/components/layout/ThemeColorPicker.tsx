import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export interface ThemeOption {
  id: string;
  name: string;
  primary: string; // 600
  hover: string;   // 700
  light: string;   // 50
  border: string;  // 200
  accent: string;  // 500
}

export const PRESET_THEMES: ThemeOption[] = [
  {
    id: 'blue',
    name: 'Electric Blue',
    primary: '#2563eb',
    hover: '#1d4ed8',
    light: '#eff6ff',
    border: '#bfdbfe',
    accent: '#3b82f6'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    primary: '#059669',
    hover: '#047857',
    light: '#ecfdf5',
    border: '#a7f3d0',
    accent: '#10b981'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#7c3aed',
    hover: '#6d28d9',
    light: '#f5f3ff',
    border: '#ddd6fe',
    accent: '#8b5cf6'
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    primary: '#e11d48',
    hover: '#be123c',
    light: '#fff1f2',
    border: '#fecdd3',
    accent: '#f43f5e'
  },
  {
    id: 'amber',
    name: 'Sunset Orange',
    primary: '#ea580c',
    hover: '#c2410c',
    light: '#fff7ed',
    border: '#fed7aa',
    accent: '#f97316'
  },
  {
    id: 'cyan',
    name: 'Ocean Teal',
    primary: '#0891b2',
    hover: '#0e7490',
    light: '#ecfeff',
    border: '#a5f3fc',
    accent: '#06b6d4'
  },
  {
    id: 'pink',
    name: 'Neon Pink',
    primary: '#db2777',
    hover: '#be185d',
    light: '#fdf2f8',
    border: '#fbcfe8',
    accent: '#ec4899'
  },
  {
    id: 'dark',
    name: 'Midnight Slate',
    primary: '#334155',
    hover: '#1e293b',
    light: '#f8fafc',
    border: '#cbd5e1',
    accent: '#475569'
  }
];

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Adjust lightness of hex
function adjustColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const num = (c: number) => {
    const res = Math.min(255, Math.max(0, Math.round(c + (c * percent) / 100)));
    return res.toString(16).padStart(2, '0');
  };
  return `#${num(rgb.r)}${num(rgb.g)}${num(rgb.b)}`;
}

export const ThemeColorPicker: React.FC = () => {
  const { showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('blue');
  const [customColor, setCustomColor] = useState<string>('#2563eb');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply theme to CSS variables
  const applyTheme = (theme: ThemeOption, save = true) => {
    const root = document.documentElement;
    root.style.setProperty('--theme-50', theme.light);
    root.style.setProperty('--theme-100', adjustColor(theme.primary, 75));
    root.style.setProperty('--theme-200', theme.border);
    root.style.setProperty('--theme-300', adjustColor(theme.primary, 45));
    root.style.setProperty('--theme-400', adjustColor(theme.primary, 25));
    root.style.setProperty('--theme-500', theme.accent);
    root.style.setProperty('--theme-600', theme.primary);
    root.style.setProperty('--theme-700', theme.hover);
    root.style.setProperty('--theme-800', adjustColor(theme.primary, -25));
    root.style.setProperty('--theme-900', adjustColor(theme.primary, -40));
    root.style.setProperty('--theme-ring', `${theme.primary}33`);

    setSelectedThemeId(theme.id);
    setCustomColor(theme.primary);

    if (save) {
      localStorage.setItem('nexora_theme_id', theme.id);
      localStorage.setItem('nexora_theme_data', JSON.stringify(theme));
    }
  };

  // Apply custom hex color
  const applyCustomHex = (hex: string) => {
    const theme: ThemeOption = {
      id: 'custom',
      name: 'Custom',
      primary: hex,
      hover: adjustColor(hex, -20),
      light: adjustColor(hex, 85),
      border: adjustColor(hex, 60),
      accent: hex
    };
    applyTheme(theme, true);
    setSelectedThemeId('custom');
    setCustomColor(hex);
    showToast('Custom theme color applied!', 'info');
  };

  // Load saved theme on initial render
  useEffect(() => {
    try {
      const savedThemeData = localStorage.getItem('nexora_theme_data');
      if (savedThemeData) {
        const parsed = JSON.parse(savedThemeData) as ThemeOption;
        applyTheme(parsed, false);
        return;
      }
      const savedThemeId = localStorage.getItem('nexora_theme_id');
      if (savedThemeId) {
        const found = PRESET_THEMES.find((t) => t.id === savedThemeId);
        if (found) {
          applyTheme(found, false);
          return;
        }
      }
    } catch {
      // Default to blue
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTheme = PRESET_THEMES.find((t) => t.id === selectedThemeId);

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      {/* Trigger Button - Sits right beside user F avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${
          isOpen
            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-600 scale-105'
            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Change Website Theme Color"
        aria-label="Theme Color Switcher"
      >
        <Palette className="w-4 h-4 transition-transform active:rotate-45" />
        
        {/* Dynamic color dot indicator */}
        <span
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs"
          style={{ backgroundColor: activeTheme ? activeTheme.primary : customColor }}
        />
      </button>

      {/* Popover Color Picker */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: activeTheme ? activeTheme.primary : customColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-display">
                  Website Theme Colors
                </h4>
                <p className="text-[10px] text-slate-400">
                  Select your favorite store theme
                </p>
              </div>
            </div>

            {/* Reset to Default */}
            <button
              type="button"
              onClick={() => {
                const defaultTheme = PRESET_THEMES[0];
                applyTheme(defaultTheme, true);
                showToast('Reset to default Blue theme', 'info');
              }}
              className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
              title="Reset to default Electric Blue"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Preset Swatches Grid */}
          <div className="py-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-2">
              Popular Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      applyTheme(theme, true);
                      showToast(`Applied ${theme.name} theme!`, 'success');
                    }}
                    className={`group relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[10px] font-medium text-slate-700 text-center leading-tight truncate w-full">
                      {theme.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 shadow-xs shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => applyCustomHex(e.target.value)}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer border-0 p-0"
                    title="Choose any custom color"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Custom Color Wheel
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">
                    {customColor}
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md font-medium">
                Pick Any Hex
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
