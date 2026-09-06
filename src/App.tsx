import React, { useState, useEffect, useCallback } from 'react';
import { MEME_TEMPLATES } from './data/templates';
import { MemeTemplate, TextStyleConfig, StickerItem, MagicCaption, ImageAnalysis } from './types';
import { DEFAULT_IMAGE_FILTERS } from './utils/canvasRenderer';
import { Navbar } from './components/Navbar';
import { TemplateSelector } from './components/TemplateSelector';
import { MemeCanvasPreview } from './components/MemeCanvasPreview';
import { TextEditorControls } from './components/TextEditorControls';
import { MagicCaptionPanel } from './components/MagicCaptionPanel';
import { ImageAnalysisModal } from './components/ImageAnalysisModal';
import { AiImageCreatorModal } from './components/AiImageCreatorModal';
import { Sparkles, UploadCloud } from 'lucide-react';

export default function App() {
  const defaultTemplate = MEME_TEMPLATES[0];

  const [currentImageSrc, setCurrentImageSrc] = useState<string>(defaultTemplate.imageUrl);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplate.id);
  const [topText, setTopText] = useState<string>(defaultTemplate.defaultTopText || '');
  const [bottomText, setBottomText] = useState<string>(defaultTemplate.defaultBottomText || '');

  const [style, setStyle] = useState<TextStyleConfig>({
    fontFamily: 'Impact',
    fontSize: 54,
    textColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 5,
    isUppercase: true,
    format: 'classic',
    textAlign: 'center',
    shadow: true,
    filters: DEFAULT_IMAGE_FILTERS,
  });

  const [stickers, setStickers] = useState<StickerItem[]>([]);

  // Magic Captions State
  const [magicCaptions, setMagicCaptions] = useState<MagicCaption[]>([]);
  const [isMagicLoading, setIsMagicLoading] = useState<boolean>(false);
  const [magicError, setMagicError] = useState<string | null>(null);

  // Image Analysis State
  const [analysisData, setAnalysisData] = useState<ImageAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);

  // AI Image Creator Modal State
  const [isAiImageModalOpen, setIsAiImageModalOpen] = useState<boolean>(false);

  // Drag and Drop state
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Helper to ensure any image (SVG or raster) is sent to Gemini as raster JPEG base64
  const getRasterBase64 = useCallback(async (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(1000, img.naturalWidth || 600);
        canvas.height = Math.min(1000, img.naturalHeight || 600);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }, []);

  // Handler: Selecting a template
  const handleSelectTemplate = (tpl: MemeTemplate) => {
    setSelectedTemplateId(tpl.id);
    setCurrentImageSrc(tpl.imageUrl);
    setTopText(tpl.defaultTopText || '');
    setBottomText(tpl.defaultBottomText || '');
    setMagicCaptions([]);
    setAnalysisData(null);
  };

  // Handler: Uploading an image file
  const handleUploadImage = (dataUrl: string) => {
    setCurrentImageSrc(dataUrl);
    setSelectedTemplateId('custom-upload');
    setTopText('');
    setBottomText('');
    setMagicCaptions([]);
    setAnalysisData(null);
    // Auto-trigger magic captions on upload for seamless UX
    generateMagicCaptionsForImage(dataUrl, 'mixed');
  };

  // Handler: Generate Magic Captions with Gemini 3.1 Pro
  const generateMagicCaptionsForImage = async (imageSrc: string, styleTheme: string) => {
    setIsMagicLoading(true);
    setMagicError(null);

    try {
      const rasterBase64 = await getRasterBase64(imageSrc);

      const response = await fetch('/api/gemini/magic-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: rasterBase64,
          mimeType: 'image/jpeg',
          style: styleTheme,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate captions');
      }

      setMagicCaptions(data.captions || []);
    } catch (err: any) {
      console.error(err);
      setMagicError(err.message || 'Error communicating with Gemini 3.1 Pro.');
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleTriggerMagicCaption = () => {
    generateMagicCaptionsForImage(currentImageSrc, 'mixed');
    // Smooth scroll down to magic caption panel if on smaller screens
    const panel = document.getElementById('magic-caption-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler: Apply chosen Magic Caption to the canvas
  const handleApplyCaption = (caption: MagicCaption) => {
    setTopText(caption.topText || '');
    setBottomText(caption.bottomText || '');
    if (!caption.topText) {
      setStyle((prev) => ({ ...prev, format: prev.format === 'modern-banner' ? 'modern-banner' : 'bottom-punchline' }));
    } else {
      setStyle((prev) => ({ ...prev, format: prev.format === 'bottom-punchline' ? 'classic' : prev.format }));
    }
  };

  // Handler: Deep Image Understanding Analysis with Gemini 3.1 Pro
  const handleAnalyzeImage = async () => {
    setIsAnalysisModalOpen(true);
    if (analysisData) return; // Already analyzed current image

    setIsAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const rasterBase64 = await getRasterBase64(currentImageSrc);

      const response = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: rasterBase64,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      setAnalysisData(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Error analyzing image with Gemini.');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Handler: Reset meme
  const handleReset = () => {
    setTopText(defaultTemplate.defaultTopText || '');
    setBottomText(defaultTemplate.defaultBottomText || '');
    setCurrentImageSrc(defaultTemplate.imageUrl);
    setSelectedTemplateId(defaultTemplate.id);
    setStickers([]);
    setMagicCaptions([]);
    setAnalysisData(null);
    setStyle({
      fontFamily: 'Impact',
      fontSize: 54,
      textColor: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 5,
      isUppercase: true,
      format: 'classic',
      textAlign: 'center',
      shadow: true,
      filters: DEFAULT_IMAGE_FILTERS,
    });
  };

  // Global Drag and Drop File Listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        handleUploadImage(res);
      }
    };
    reader.readAsDataURL(file);
  };

  // Clipboard Paste Support (Ctrl+V / Cmd+V anywhere to load image from clipboard)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const res = ev.target?.result as string;
              if (res) {
                handleUploadImage(res);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div
      id="meme-generator-app"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white font-sans"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-md border-4 border-dashed border-indigo-500 flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className="w-16 h-16 text-indigo-400 animate-bounce mb-3" />
          <p className="text-xl font-bold text-white">Drop your image here to create a meme!</p>
          <p className="text-sm text-indigo-300 mt-1">Gemini 3.1 Pro will auto-suggest 5 magic captions</p>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onUploadImage={handleUploadImage}
        onOpenAiModal={() => setIsAiImageModalOpen(true)}
        onOpenAnalysis={handleAnalyzeImage}
        onReset={handleReset}
        onTriggerMagicCaption={handleTriggerMagicCaption}
        isMagicLoading={isMagicLoading}
      />

      {/* Main Studio Body - 3-Column Immersive UI Layout */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Templates & Text Customization Controls (4 Cols) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-5 order-2 lg:order-1">
          {/* Template Gallery */}
          <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-4 shadow-xl backdrop-blur-xl">
            <TemplateSelector
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={handleSelectTemplate}
              onUploadImage={handleUploadImage}
            />
          </div>

          {/* Text & Typography Controls */}
          <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-4 shadow-xl backdrop-blur-xl">
            <TextEditorControls
              topText={topText}
              setTopText={setTopText}
              bottomText={bottomText}
              setBottomText={setBottomText}
              style={style}
              setStyle={setStyle}
              stickers={stickers}
              setStickers={setStickers}
            />
          </div>
        </div>

        {/* Center Column: Live Meme Preview Stage (4-5 Cols) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 bg-black/30 rounded-2xl border border-white/5 p-4 sm:p-6 backdrop-blur-sm">
          <MemeCanvasPreview
            imageSrc={currentImageSrc}
            topText={topText}
            bottomText={bottomText}
            style={style}
            stickers={stickers}
            setStickers={setStickers}
            onOpenAnalysis={handleAnalyzeImage}
            onOpenAiImageModal={() => setIsAiImageModalOpen(true)}
            onUploadImage={handleUploadImage}
          />
        </div>

        {/* Right Column: Magic Caption Panel (4 Cols) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-5 order-3">
          <MagicCaptionPanel
            currentImageBase64={currentImageSrc}
            onApplyCaption={handleApplyCaption}
            isLoading={isMagicLoading}
            onGenerateCaptions={(theme) => generateMagicCaptionsForImage(currentImageSrc, theme)}
            captions={magicCaptions}
            errorMessage={magicError}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          AI Meme Generator • Multimodal image context analysis powered by{' '}
          <strong className="text-slate-400">Gemini 3.1 Pro</strong> and image creation powered by{' '}
          <strong className="text-slate-400">Gemini Flash Image</strong>
        </p>
      </footer>

      {/* Modals */}
      <ImageAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        analysis={analysisData}
        isLoading={isAnalysisLoading}
        onAnalyze={handleAnalyzeImage}
        errorMessage={analysisError}
      />

      <AiImageCreatorModal
        isOpen={isAiImageModalOpen}
        onClose={() => setIsAiImageModalOpen(false)}
        currentImageBase64={currentImageSrc}
        onImageReady={(newUrl) => {
          setCurrentImageSrc(newUrl);
          setSelectedTemplateId('ai-generated');
          generateMagicCaptionsForImage(newUrl, 'mixed');
        }}
      />
    </div>
  );
}
