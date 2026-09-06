import React, { useState, useRef } from 'react';
import { MEME_TEMPLATES } from '../data/templates';
import { MemeTemplate } from '../types';
import { Flame, Sparkles, Cat, MessageSquare, Award, UploadCloud } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: MemeTemplate) => void;
  onUploadImage?: (dataUrl: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onUploadImage,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        onUploadImage(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so user can re-upload same file if desired
    e.target.value = '';
  };

  const categories = [
    { id: 'all', label: 'All Templates', icon: Flame },
    { id: 'trending', label: 'Trending', icon: Sparkles },
    { id: 'classic', label: 'Classics', icon: Award },
    { id: 'reaction', label: 'Reactions', icon: MessageSquare },
    { id: 'animals', label: 'Animals', icon: Cat },
  ];

  const filtered = activeCategory === 'all'
    ? MEME_TEMPLATES
    : MEME_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div id="template-selector-container" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Meme Backgrounds
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">
          {filtered.length} templates
        </span>
      </div>

      {/* Upload Image from Device Button */}
      {onUploadImage && (
        <div>
          <input
            type="file"
            id="custom-file-input-sidebar"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            id="upload-image-sidebar-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Upload Image from Device</span>
          </button>
        </div>
      )}

      {/* Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-500 text-white font-semibold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid matching Immersive UI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
        {filtered.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;
          return (
            <button
              key={tpl.id}
              id={`template-btn-${tpl.id}`}
              type="button"
              onClick={() => onSelectTemplate(tpl)}
              className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-indigo-500/60 ring-2 ring-indigo-500/30 shadow-lg'
                  : 'bg-slate-800/80 border-white/5 hover:border-indigo-500/50 hover:bg-slate-800'
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none z-10" />
              )}
              <div className="aspect-square w-full bg-slate-900/90 overflow-hidden flex items-center justify-center p-1.5">
                <img
                  src={tpl.imageUrl}
                  alt={tpl.name}
                  className="w-full h-full object-contain rounded"
                  loading="lazy"
                />
              </div>
              <div className="p-1.5 bg-slate-900/60 border-t border-white/5">
                <p className="text-[11px] font-medium text-slate-300 truncate group-hover:text-indigo-300">
                  {tpl.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
