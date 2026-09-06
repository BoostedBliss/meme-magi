import React from 'react';
import { ImageAnalysis } from '../types';
import { X, Sparkles, Brain, Gauge, Eye, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ImageAnalysis | null;
  isLoading: boolean;
  onAnalyze: () => void;
  errorMessage: string | null;
}

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
  onAnalyze,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="image-analysis-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  AI Image Understanding
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">
                  Gemini 3.1 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deep visual analysis of emotion, comedic cues & meme potential
              </p>
            </div>
          </div>

          <button
            id="close-analysis-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-sm font-semibold text-indigo-300">
              Analyzing photo with Gemini 3.1 Pro...
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Detecting facial micro-expressions, visual irony, and calculating meme potential score.
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {!isLoading && analysis && (
          <div className="space-y-4">
            {/* Score & Mood Banner */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Memeability Score</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-indigo-400">
                    {analysis.memeabilityScore}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, analysis.memeabilityScore))}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Detected Mood</span>
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-2">
                  {analysis.detectedMood}
                </p>
              </div>
            </div>

            {/* Visual Summary */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visual Breakdown
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                {analysis.visualSummary}
              </p>
            </div>

            {/* Key Visual Elements */}
            {analysis.keyElements && analysis.keyElements.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notable Meme Elements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keyElements.map((el, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-200"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comedic Angles */}
            {analysis.comedicAngles && analysis.comedicAngles.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Comedic Angles to Exploit</span>
                </div>
                <div className="space-y-1.5">
                  {analysis.comedicAngles.map((angle, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200/90 font-medium"
                    >
                      👉 {angle}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <button
            id="re-analyze-btn"
            type="button"
            disabled={isLoading}
            onClick={onAnalyze}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Analyze</span>
          </button>

          <button
            id="dismiss-analysis-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
