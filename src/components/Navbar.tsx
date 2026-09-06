import React, { useRef } from 'react';
import { Sparkles, Upload, Wand2, Brain, RotateCcw, Flame } from 'lucide-react';

interface NavbarProps {
  onUploadImage: (dataUrl: string) => void;
  onOpenAiModal: () => void;
  onOpenAnalysis: () => void;
  onReset: () => void;
  onTriggerMagicCaption: () => void;
  isMagicLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onUploadImage,
  onOpenAiModal,
  onOpenAnalysis,
  onReset,
  onTriggerMagicCaption,
  isMagicLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUploadImage(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="font-black text-white text-xs italic">M</span>
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
            MemeMagic <span className="text-indigo-400">AI</span>
          </h1>
        </div>
      </div>

      {/* Center Studio Nav Tabs from Immersive UI */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          type="button"
          className="text-white border-b-2 border-indigo-500 pb-1 cursor-pointer transition-colors"
        >
          Studio
        </button>
        <button
          type="button"
          onClick={onOpenAiModal}
          className="hover:text-white transition-colors cursor-pointer"
        >
          AI Generator
        </button>
        <button
          type="button"
          onClick={onOpenAnalysis}
          className="hover:text-white transition-colors cursor-pointer"
        >
          AI Inspector
        </button>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="meme-image-file-input"
        />

        {/* Upload Button */}
        <button
          id="upload-image-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 hover:text-white transition-all"
          title="Upload your own photo or meme"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Upload Image</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* AI Image Generation / Edit Button */}
        <button
          id="ai-create-image-btn"
          type="button"
          onClick={onOpenAiModal}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 hover:text-white transition-all"
          title="Generate or edit images with Gemini Flash"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Studio</span>
        </button>

        {/* Image Understanding / Analysis */}
        <button
          id="analyze-image-btn"
          type="button"
          onClick={onOpenAnalysis}
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 hover:text-white transition-all"
          title="Deep image context analysis with Gemini 3.1 Pro"
        >
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>Inspect</span>
        </button>

        {/* Core Feature: Magic Caption Button */}
        <button
          id="nav-magic-caption-btn"
          type="button"
          disabled={isMagicLoading}
          onClick={onTriggerMagicCaption}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.35)] hover:brightness-110 active:brightness-90 transition-all"
        >
          <Wand2 className={`w-3.5 h-3.5 ${isMagicLoading ? 'animate-spin' : ''}`} />
          <span>Magic Caption</span>
        </button>

        {/* Reset button */}
        <button
          id="reset-meme-btn"
          type="button"
          onClick={onReset}
          className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 border border-white/10 hover:bg-slate-700 transition-colors"
          title="Reset meme to defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
