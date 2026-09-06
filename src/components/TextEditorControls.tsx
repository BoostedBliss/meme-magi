import React, { useState } from 'react';
import { TextStyleConfig, MemeFormat, StickerItem, FilterPreset, ImageFilterConfig } from '../types';
import { FILTER_PRESETS, DEFAULT_IMAGE_FILTERS } from '../utils/canvasRenderer';
import {
  Type,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Trash2,
  Smile,
  Palette,
  Sliders,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Sun,
  Contrast,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TextEditorControlsProps {
  topText: string;
  setTopText: (text: string) => void;
  bottomText: string;
  setBottomText: (text: string) => void;
  style: TextStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<TextStyleConfig>>;
  stickers: StickerItem[];
  setStickers: React.Dispatch<React.SetStateAction<StickerItem[]>>;
}

export const TextEditorControls: React.FC<TextEditorControlsProps> = ({
  topText,
  setTopText,
  bottomText,
  setBottomText,
  style,
  setStyle,
  stickers,
  setStickers,
}) => {
  const [showFineTune, setShowFineTune] = useState<boolean>(false);
  const currentFilters = style.filters || DEFAULT_IMAGE_FILTERS;

  const fontOptions: TextStyleConfig['fontFamily'][] = [
    'Impact',
    'Anton',
    'Bebas Neue',
    'Comic Neue',
    'Plus Jakarta Sans',
  ];

  const colorPresets = [
    { label: 'White', value: '#FFFFFF' },
    { label: 'Yellow', value: '#FACC15' },
    { label: 'Cyan', value: '#38BDF8' },
    { label: 'Green', value: '#4ADE80' },
    { label: 'Red', value: '#F87171' },
    { label: 'Black', value: '#000000' },
  ];

  const popularStickers = ['😂', '💀', '🔥', '🕶️', '🤡', '🚀', '🧢', '💯', '🤦', '🤯', '🗿', '🍿'];

  const addSticker = (symbol: string) => {
    const newSticker: StickerItem = {
      id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      symbol,
      xPercent: 50 + (Math.random() * 20 - 10),
      yPercent: 50 + (Math.random() * 20 - 10),
      size: 50,
      rotation: Math.floor(Math.random() * 20 - 10),
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleApplyPreset = (presetKey: FilterPreset) => {
    const target = FILTER_PRESETS[presetKey];
    if (!target) return;
    setStyle((prev) => ({
      ...prev,
      filters: {
        preset: presetKey,
        ...target.config,
      },
    }));
  };

  const handleFilterChange = (field: keyof ImageFilterConfig, val: number) => {
    setStyle((prev) => ({
      ...prev,
      filters: {
        ...(prev.filters || DEFAULT_IMAGE_FILTERS),
        preset: 'custom',
        [field]: val,
      },
    }));
  };

  const handleResetFilters = () => {
    setStyle((prev) => ({
      ...prev,
      filters: DEFAULT_IMAGE_FILTERS,
    }));
  };

  const isFilterActive =
    currentFilters.preset !== 'none' ||
    currentFilters.grayscale > 0 ||
    currentFilters.sepia > 0 ||
    currentFilters.contrast !== 100 ||
    currentFilters.brightness !== 100 ||
    currentFilters.saturate !== 100 ||
    currentFilters.blur > 0 ||
    currentFilters.invert > 0 ||
    currentFilters.hueRotate > 0;

  return (
    <div id="text-editor-controls" className="space-y-4">
      {/* Format Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Meme Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'classic', label: 'Classic Impact', desc: 'Top & Bottom' },
              { id: 'modern-banner', label: 'White Banner', desc: 'Header Style' },
              { id: 'bottom-punchline', label: 'Bottom Only', desc: 'Punchline' },
            ] as { id: MemeFormat; label: string; desc: string }[]
          ).map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              id={`format-btn-${fmt.id}`}
              onClick={() => setStyle((prev) => ({ ...prev, format: fmt.id }))}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                style.format === fmt.id
                  ? 'bg-indigo-500/20 border-indigo-500/60 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'bg-slate-800/80 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
              }`}
            >
              <p className="text-xs font-bold">{fmt.label}</p>
              <p className="text-[10px] text-slate-500 truncate">{fmt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Top and Bottom Text Inputs */}
      <div className="space-y-3">
        {style.format !== 'bottom-punchline' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                {style.format === 'modern-banner' ? 'Banner Header Caption' : 'Top Text'}
              </label>
              {topText && (
                <button
                  type="button"
                  onClick={() => setTopText('')}
                  className="text-[11px] text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              id="top-text-input"
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="ENTER TOP TEXT..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-300">
              {style.format === 'modern-banner' ? 'Sub-caption / Punchline' : 'Bottom Text'}
            </label>
            {bottomText && (
              <button
                type="button"
                onClick={() => setBottomText('')}
                className="text-[11px] text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <input
            id="bottom-text-input"
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="ENTER BOTTOM PUNCHLINE..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-bold"
          />
        </div>
      </div>

      {/* Font & Styling Controls Accordion/Row */}
      <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Typography & Visuals</span>
        </div>

        {/* Font Family & Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Font Family</label>
            <select
              id="font-family-select"
              value={style.fontFamily}
              onChange={(e) =>
                setStyle((prev) => ({
                  ...prev,
                  fontFamily: e.target.value as TextStyleConfig['fontFamily'],
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Alignment</label>
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/10">
              {(
                [
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight },
                ] as const
              ).map((align) => {
                const Icon = align.icon;
                return (
                  <button
                    key={align.id}
                    type="button"
                    onClick={() => setStyle((prev) => ({ ...prev, textAlign: align.id }))}
                    className={`flex-1 py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                      style.textAlign === align.id
                        ? 'bg-indigo-500 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Font Size & Stroke Width Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Text Size</span>
              <span className="font-mono text-indigo-400">{style.fontSize}</span>
            </div>
            <input
              id="font-size-slider"
              type="range"
              min="20"
              max="90"
              value={style.fontSize}
              onChange={(e) =>
                setStyle((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
              }
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Outline Width</span>
              <span className="font-mono text-indigo-400">{style.strokeWidth}</span>
            </div>
            <input
              id="stroke-width-slider"
              type="range"
              min="0"
              max="10"
              value={style.strokeWidth}
              onChange={(e) =>
                setStyle((prev) => ({ ...prev, strokeWidth: Number(e.target.value) }))
              }
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Color Presets & Uppercase Toggle */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Color:</span>
            {colorPresets.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setStyle((prev) => ({ ...prev, textColor: c.value }))}
                style={{ backgroundColor: c.value }}
                title={c.label}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                  style.textColor === c.value
                    ? 'border-indigo-400 scale-110 ring-2 ring-indigo-400/40'
                    : 'border-slate-700 hover:scale-105'
                }`}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              id="uppercase-toggle"
              type="checkbox"
              checked={style.isUppercase}
              onChange={(e) =>
                setStyle((prev) => ({ ...prev, isUppercase: e.target.checked }))
              }
              className="rounded accent-indigo-500 bg-slate-950 border-slate-700"
            />
            <span className="font-mono text-[11px]">ALL-CAPS</span>
          </label>
        </div>
      </div>

      {/* Meme Stickers & Emoji Bar */}
      <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Smile className="w-3.5 h-3.5 text-indigo-400" />
            <span>Meme Stickers & Emojis</span>
          </div>
          {stickers.length > 0 && (
            <button
              type="button"
              onClick={() => setStickers([])}
              className="text-[10px] text-slate-500 hover:text-red-400 cursor-pointer"
            >
              Clear all ({stickers.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {popularStickers.map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => addSticker(symbol)}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-white/5 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              {symbol}
            </button>
          ))}
        </div>

        {/* Active sticker management */}
        {stickers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
            {stickers.map((stk) => (
              <span
                key={stk.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-200 border border-white/5"
              >
                <span>{stk.symbol}</span>
                <button
                  type="button"
                  onClick={() => removeSticker(stk.id)}
                  className="text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Background Image Filters & Visual Effects */}
      <div id="image-filters-controls" className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Background Image Filters</span>
          </div>

          <div className="flex items-center gap-2">
            {isFilterActive && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                {currentFilters.preset === 'custom'
                  ? 'Custom FX'
                  : FILTER_PRESETS[currentFilters.preset]?.label || 'Active'}
              </span>
            )}
            {isFilterActive && (
              <button
                type="button"
                id="reset-filters-btn"
                onClick={handleResetFilters}
                className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset all image filters to normal"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Preset Buttons Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(FILTER_PRESETS) as FilterPreset[]).map((key) => {
            const preset = FILTER_PRESETS[key];
            const isSelected = currentFilters.preset === key;

            return (
              <button
                key={key}
                type="button"
                id={`filter-preset-${key}`}
                onClick={() => handleApplyPreset(key)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500/60 text-white shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                    : 'bg-slate-800/70 border-white/5 text-slate-300 hover:border-white/15 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold block truncate">{preset.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-1 animate-pulse" />
                  )}
                </div>
                <span className="text-[9px] text-slate-400 block truncate leading-tight mt-0.5">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expandable Fine-Tune Adjustments */}
        <div className="pt-2 border-t border-white/5">
          <button
            type="button"
            id="toggle-fine-tune-filters-btn"
            onClick={() => setShowFineTune((prev) => !prev)}
            className="w-full flex items-center justify-between text-left py-1 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Fine-Tune Sliders & Adjustments</span>
            </div>
            {showFineTune ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showFineTune && (
            <div className="space-y-3 pt-2.5 pb-1">
              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Contrast className="w-3 h-3 text-indigo-400" />
                    Contrast
                  </span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.contrast}%</span>
                </div>
                <input
                  id="filter-contrast-slider"
                  type="range"
                  min="50"
                  max="250"
                  step="5"
                  value={currentFilters.contrast}
                  onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    Brightness
                  </span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.brightness}%</span>
                </div>
                <input
                  id="filter-brightness-slider"
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={currentFilters.brightness}
                  onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    Saturation
                  </span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.saturate}%</span>
                </div>
                <input
                  id="filter-saturation-slider"
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={currentFilters.saturate}
                  onChange={(e) => handleFilterChange('saturate', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Grayscale (B&W)</span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.grayscale}%</span>
                </div>
                <input
                  id="filter-grayscale-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentFilters.grayscale}
                  onChange={(e) => handleFilterChange('grayscale', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Sepia Tone</span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.sepia}%</span>
                </div>
                <input
                  id="filter-sepia-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentFilters.sepia}
                  onChange={(e) => handleFilterChange('sepia', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Atmospheric Blur</span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.blur}px</span>
                </div>
                <input
                  id="filter-blur-slider"
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={currentFilters.blur}
                  onChange={(e) => handleFilterChange('blur', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Invert */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Color Inversion</span>
                  <span className="font-mono text-slate-300 font-bold">{currentFilters.invert}%</span>
                </div>
                <input
                  id="filter-invert-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={currentFilters.invert}
                  onChange={(e) => handleFilterChange('invert', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
