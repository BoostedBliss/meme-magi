import React, { useState } from 'react';
import { MagicCaption } from '../types';
import { Sparkles, Wand2, RefreshCw, Check, ArrowRight, AlertCircle } from 'lucide-react';

interface MagicCaptionPanelProps {
  currentImageBase64: string | null;
  onApplyCaption: (caption: MagicCaption) => void;
  isLoading: boolean;
  onGenerateCaptions: (style: string) => void;
  captions: MagicCaption[];
  errorMessage: string | null;
}

export const MagicCaptionPanel: React.FC<MagicCaptionPanelProps> = ({
  currentImageBase64,
  onApplyCaption,
  isLoading,
  onGenerateCaptions,
  captions,
  errorMessage,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('mixed');
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  const stylePresets = [
    { id: 'mixed', label: 'Mixed Humor' },
    { id: 'tech-work', label: 'Tech & Work' },
    { id: 'procrastination', label: 'Relatable Life' },
    { id: 'sarcasm', label: 'Sarcastic & Dry' },
    { id: 'absurd', label: 'Absurd & Gen-Z' },
  ];

  const handleApply = (caption: MagicCaption, index: number) => {
    setAppliedIndex(index);
    onApplyCaption(caption);
    setTimeout(() => {
      setAppliedIndex(null);
    }, 1800);
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    if (currentImageBase64) {
      onGenerateCaptions(styleId);
    }
  };

  return (
    <div
      id="magic-caption-panel"
      className="bg-slate-900/40 rounded-2xl border border-white/5 p-5 shadow-2xl backdrop-blur-xl space-y-4"
    >
      {/* Hero Action Button from Immersive UI */}
      <button
        id="magic-caption-generate-btn"
        type="button"
        disabled={isLoading || !currentImageBase64}
        onClick={() => onGenerateCaptions(selectedStyle)}
        className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isLoading || !currentImageBase64
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:brightness-110 active:brightness-90 hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing Image Context...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 text-white" />
            <span>{captions.length > 0 ? 'Regenerate Magic Captions' : 'Magic Caption (AI)'}</span>
          </>
        )}
      </button>

      {/* Vibe / Style Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
          Vibe:
        </span>
        {stylePresets.map((preset) => (
          <button
            key={preset.id}
            id={`preset-btn-${preset.id}`}
            type="button"
            onClick={() => handleStyleChange(preset.id)}
            disabled={isLoading}
            className={`text-xs px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedStyle === preset.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10 hover:bg-white/10'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Header Label from Immersive UI */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500 pt-1">
        <span>AI Suggestions</span>
        <span className="text-indigo-400 font-semibold lowercase tracking-normal text-[11px]">
          Gemini 3.1 Pro
        </span>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">AI Notice</p>
            <p className="mt-0.5 text-red-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md -z-10" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-300">
              Gemini 3.1 Pro is studying image emotions...
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Detecting comedic tension, faces, and crafting 5 viral punchlines.
            </p>
          </div>
        </div>
      )}

      {/* Captions List */}
      {!isLoading && captions.length > 0 && (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {captions.map((cap, idx) => {
            const isApplied = appliedIndex === idx;
            return (
              <div
                key={idx}
                id={`magic-caption-card-${idx}`}
                onClick={() => handleApply(cap, idx)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all group relative ${
                  isApplied
                    ? 'bg-indigo-500/20 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase tracking-wider">
                    #{idx + 1} {cap.category}
                  </span>
                  {isApplied ? (
                    <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded font-semibold text-white flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
                      Overlay <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Caption Content */}
                <div className="space-y-1">
                  {cap.topText && (
                    <p className="text-xs text-slate-400 font-mono tracking-wide uppercase">
                      TOP: <span className="text-slate-200 font-bold">{cap.topText}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-200 font-medium leading-relaxed group-hover:text-white">
                    {cap.bottomText}
                  </p>
                </div>

                {cap.explanation && (
                  <p className="mt-1.5 text-[10px] text-slate-500 italic">
                    "{cap.explanation}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state when no captions generated yet */}
      {!isLoading && captions.length === 0 && !errorMessage && (
        <div className="py-6 px-4 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
          <p className="text-xs text-slate-400 leading-relaxed">
            Click <strong className="text-indigo-400 font-semibold">Magic Caption</strong> to have Gemini 3.1 Pro analyze this image context and generate 5 tailored captions.
          </p>
        </div>
      )}
    </div>
  );
};
