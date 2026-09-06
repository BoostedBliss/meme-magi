import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface ShareMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  topText: string;
  bottomText: string;
}

export const ShareMemeModal: React.FC<ShareMemeModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  topText,
  bottomText,
}) => {
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [nativeShareSuccess, setNativeShareSuccess] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Formulate share caption
  const combinedCaption = [topText, bottomText].filter(Boolean).join(' - ') || 'Check out this meme!';
  const shareText = `"${combinedCaption}" #Meme #AIMeme #MemeGenerator`;
  const shareUrl = window.location.href;

  // 1. Download handlers
  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!canvasRef.current) return;
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvasRef.current.toDataURL(mime, 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `meme-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    setShareError(null);
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          setShareError('Failed to capture canvas image.');
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        } catch (err: any) {
          console.warn('Clipboard write error:', err);
          setShareError('Direct image clipboard copy not supported on this browser. Try downloading instead.');
        }
      }, 'image/png');
    } catch (e: any) {
      setShareError('Clipboard action failed.');
    }
  };

  // 3. Copy Caption Text
  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(combinedCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch (err) {
      setShareError('Failed to copy text.');
    }
  };

  // 4. Native OS / Web Share API (shares actual image file if supported)
  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    setShareError(null);

    if (!navigator.share) {
      setShareError('Web Share API is not supported on this browser. Use the platform buttons below!');
      return;
    }

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'meme.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Meme Generator Creation',
            text: combinedCaption,
            files: [file],
          });
          setNativeShareSuccess(true);
          setTimeout(() => setNativeShareSuccess(false), 2500);
        } else {
          // Fallback share text/url
          await navigator.share({
            title: 'Meme Generator Creation',
            text: `${combinedCaption}\nCreated with AI Meme Generator:`,
            url: shareUrl,
          });
        }
      }, 'image/png');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Share error:', err);
      }
    }
  };

  // 5. Social Platform URLs
  const socialPlatforms = [
    {
      name: 'X / Twitter',
      color: 'hover:bg-slate-800 text-slate-100',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        const text = encodeURIComponent(`"${combinedCaption}"\n\nGenerated with AI Meme Studio ⚡`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'Reddit',
      color: 'hover:bg-orange-600/20 text-orange-400',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.702zM9.25 12C8.56 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.094z" />
        </svg>
      ),
      action: () => {
        const title = encodeURIComponent(combinedCaption);
        window.open(`https://www.reddit.com/submit?title=${title}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'WhatsApp',
      color: 'hover:bg-emerald-600/20 text-emerald-400',
      icon: <MessageCircle className="w-4 h-4" />,
      action: () => {
        const text = encodeURIComponent(`*${combinedCaption}*\n\nCreated with AI Meme Generator: ${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      },
    },
    {
      name: 'Telegram',
      color: 'hover:bg-sky-600/20 text-sky-400',
      icon: <Send className="w-4 h-4" />,
      action: () => {
        const text = encodeURIComponent(`"${combinedCaption}" - AI Meme`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
      },
    },
    {
      name: 'Facebook',
      color: 'hover:bg-blue-600/20 text-blue-400',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(combinedCaption)}`, '_blank');
      },
    },
  ];

  return (
    <div
      id="share-meme-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Share & Export Meme
              </h3>
              <p className="text-xs text-slate-400">
                Download high-res file or share directly to social platforms
              </p>
            </div>
          </div>

          <button
            id="close-share-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Caption summary */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              Active Meme Caption
            </span>
            <p className="text-xs text-slate-200 truncate italic">
              "{combinedCaption}"
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyCaption}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copiedCaption ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        {/* Section 1: Quick Download Options */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Download Image File
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              id="download-png-modal-btn"
              type="button"
              onClick={() => handleDownload('png')}
              className="p-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download PNG (Lossless)</span>
            </button>

            <button
              id="download-jpeg-modal-btn"
              type="button"
              onClick={() => handleDownload('jpeg')}
              className="p-3.5 rounded-xl bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download JPEG (Light)</span>
            </button>
          </div>
        </div>

        {/* Section 2: Direct Clipboard Copy & Native Share */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="copy-image-modal-btn"
            type="button"
            onClick={handleCopyImage}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copiedImage
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {copiedImage ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Image Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Image to Paste</span>
              </>
            )}
          </button>

          <button
            id="native-share-btn"
            type="button"
            onClick={handleNativeShare}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              nativeShareSuccess
                ? 'bg-indigo-500/30 border-indigo-500/50 text-indigo-200'
                : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{nativeShareSuccess ? 'Shared!' : 'Device Share Sheet'}</span>
          </button>
        </div>

        {/* Error notification */}
        {shareError && (
          <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl">
            {shareError}
          </p>
        )}

        {/* Section 3: Direct Social Media Platforms */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Share to Social Platforms
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                id={`share-btn-${platform.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                type="button"
                onClick={platform.action}
                className={`p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs font-medium transition-all cursor-pointer ${platform.color} hover:border-white/20`}
              >
                <div className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                  {platform.icon}
                </div>
                <span className="truncate">{platform.name}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            💡 Pro tip: Click <strong>"Copy Image to Paste"</strong>, then press Ctrl+V directly into Discord, X, Slack, or Reddit!
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
