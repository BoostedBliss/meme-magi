import React, { useEffect, useRef, useState } from 'react';
import { TextStyleConfig, StickerItem } from '../types';
import { drawMemeOnCanvas, exportCanvasAsDataUrl, copyCanvasToClipboard } from '../utils/canvasRenderer';
import { Download, Share2, Copy, Check, Sparkles, UploadCloud } from 'lucide-react';
import { ShareMemeModal } from './ShareMemeModal';

interface MemeCanvasPreviewProps {
  imageSrc: string;
  topText: string;
  bottomText: string;
  style: TextStyleConfig;
  stickers: StickerItem[];
  setStickers: React.Dispatch<React.SetStateAction<StickerItem[]>>;
  onOpenAnalysis: () => void;
  onOpenAiImageModal: () => void;
  onUploadImage?: (dataUrl: string) => void;
}

export const MemeCanvasPreview: React.FC<MemeCanvasPreviewProps> = ({
  imageSrc,
  topText,
  bottomText,
  style,
  stickers,
  setStickers,
  onOpenAnalysis,
  onOpenAiImageModal,
  onUploadImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [draggedStickerId, setDraggedStickerId] = useState<string | null>(null);

  // Load Image element whenever imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-draw canvas whenever any visual parameter updates
  useEffect(() => {
    if (!canvasRef.current || !imageElement) return;

    drawMemeOnCanvas({
      canvas: canvasRef.current,
      image: imageElement,
      topText,
      bottomText,
      style,
      stickers,
    });
  }, [imageElement, topText, bottomText, style, stickers]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = exportCanvasAsDataUrl(canvasRef.current, 'image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `meme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result as string;
      if (res) onUploadImage(res);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Dragging stickers directly on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || stickers.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Find nearest sticker within 15% distance
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const dist = Math.hypot(s.xPercent - clickX, s.yPercent - clickY);
      if (dist < 12) {
        setDraggedStickerId(s.id);
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedStickerId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setStickers((prev) =>
      prev.map((s) =>
        s.id === draggedStickerId ? { ...s, xPercent: newX, yPercent: newY } : s
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggedStickerId(null);
  };

  return (
    <div id="meme-canvas-preview-container" className="flex flex-col items-center justify-center space-y-6 w-full">
      {/* Canvas Viewport from Immersive UI */}
      <div
        ref={containerRef}
        className="w-full max-w-lg aspect-square bg-slate-900 rounded-2xl shadow-2xl shadow-black relative overflow-hidden border border-white/5 flex items-center justify-center p-3"
      >
        <canvas
          ref={canvasRef}
          id="meme-canvas"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-crosshair transition-transform"
        />

        {/* Resolution Badge from Immersive UI */}
        <div className="absolute top-4 right-4 flex gap-2 pointer-events-none z-10">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded text-[10px] font-mono border border-white/5 text-slate-300">
            1080x1080
          </div>
        </div>

        {!imageElement && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-medium">
            Loading meme visual...
          </div>
        )}
      </div>

      {/* Hidden file input for stage image upload */}
      {onUploadImage && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="stage-upload-input"
        />
      )}

      {/* Action Buttons matching Immersive UI */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          id="download-meme-btn"
          type="button"
          onClick={handleDownload}
          className="px-6 sm:px-8 py-3 bg-white text-slate-950 font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-950" />
          <span>Download</span>
        </button>

        <button
          id="open-share-modal-btn"
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="px-6 sm:px-8 py-3 font-bold rounded-xl border border-white/10 bg-slate-800 text-white hover:bg-slate-700 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Share2 className="w-4 h-4 text-indigo-400" />
          <span>Share Meme</span>
        </button>

        {onUploadImage && (
          <button
            id="stage-upload-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Upload custom image file from device"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Upload Image</span>
          </button>
        )}
      </div>

      {/* Canvas bottom tips & inspect helper */}
      <div className="flex items-center justify-between gap-4 text-[11px] text-slate-500 max-w-lg w-full px-2">
        <span>💡 Drag stickers or click suggestions to overlay</span>
        <button
          type="button"
          id="quick-analyze-btn"
          onClick={onOpenAnalysis}
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
        >
          Inspect Visual Context →
        </button>
      </div>

      {/* Share & Export Modal */}
      <ShareMemeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        canvasRef={canvasRef}
        topText={topText}
        bottomText={bottomText}
      />
    </div>
  );
};
