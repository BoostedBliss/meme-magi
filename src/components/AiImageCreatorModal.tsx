import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Wand2, RefreshCw, AlertCircle } from 'lucide-react';

interface AiImageCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageBase64: string | null;
  onImageReady: (dataUrl: string) => void;
}

export const AiImageCreatorModal: React.FC<AiImageCreatorModalProps> = ({
  isOpen,
  onClose,
  currentImageBase64,
  onImageReady,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPromptIdeas = [
    'A confused cat in a formal corporate business suit at an urgent board meeting',
    'A Shiba Inu dog wearing aviator sunglasses and sipping iced coffee',
    'A medieval knight panicking while looking at an error screen on an iPad',
    'A dramatic dramatic hamster looking into the distance in thunderstorm',
    'A software developer praying to a server tower glowing with divine light',
  ];

  const quickEditIdeas = [
    'Add glowing red laser eyes',
    'Add pixelated black thug life sunglasses and a gold chain',
    'Make it look like a vintage 90s cartoon',
    'Add dramatic cinematic fire and explosions in the background',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (activeTab === 'create') {
        const res = await fetch('/api/gemini/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate image');
        onImageReady(data.imageUrl);
        onClose();
      } else {
        if (!currentImageBase64) {
          throw new Error('No base image to edit. Please upload or select an image first.');
        }
        const res = await fetch('/api/gemini/edit-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: currentImageBase64,
            prompt,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to edit image');
        onImageReady(data.imageUrl);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Image processing failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ai-image-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  AI Meme Image Studio
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">
                  gemini-3.1-flash-image-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate or modify meme visuals directly with text prompts
              </p>
            </div>
          </div>

          <button
            id="close-ai-image-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-950/80 rounded-xl border border-white/10">
          <button
            type="button"
            id="tab-create-img"
            onClick={() => setActiveTab('create')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Generate New Image</span>
          </button>
          <button
            type="button"
            id="tab-edit-img"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Edit Current Image</span>
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {activeTab === 'create' ? 'Meme Visual Prompt' : 'Instruction for Image Edit'}
            </label>
            <textarea
              id="ai-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeTab === 'create'
                  ? 'Describe an absurd, hilarious scene (e.g. A cat sitting at an interrogation table looking guilty)...'
                  : 'Describe what to add or change (e.g. Add laser eyes and retro neon glow)...'
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Aspect Ratio for Create Mode */}
          {activeTab === 'create' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Aspect Ratio:</span>
              {['1:1', '4:3', '16:9'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          )}

          {/* Quick Idea Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-medium text-slate-400">
              Quick Inspiration:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(activeTab === 'create' ? quickPromptIdeas : quickEditIdeas).map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-indigo-300 transition-colors text-left cursor-pointer"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="run-ai-image-btn"
            type="button"
            disabled={isLoading || !prompt.trim()}
            onClick={handleGenerate}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isLoading || !prompt.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:brightness-110 active:brightness-90'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{activeTab === 'create' ? 'Generate Image' : 'Apply AI Edit'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
