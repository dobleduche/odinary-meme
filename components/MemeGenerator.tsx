import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Meme } from '../types';
import { MagicWandIcon, XIcon, LoaderIcon, ShareIcon } from './Icons';

interface MemeGeneratorProps {
  onMemeGenerated: (meme: Meme) => void;
}

const memeTemplates = [
    { id: 'odinary-mascot', name: 'ODINARY Mascot', url: 'https://i.imgur.com/2OFa2a1.png' },
    { id: 'drake', name: 'Drakeposting', url: 'https://i.imgflip.com/30b1gx.jpg' },
    { id: 'distracted-bf', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
    { id: 'two-buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
    { id: 'change-my-mind', name: 'Change My Mind', url: 'https://i.imgflip.com/24x433.jpg' },
];

const createShortHash = (text1: string, text2: string) => {
    const combined = text1.trim() + text2.trim();
    if (!combined) return 'ODNRY1';
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return `ODNRY${Math.abs(hash).toString(36).slice(0, 4).toUpperCase()}`;
};

// Helper to safely get settings from localStorage
const getStoredSetting = (key: string, fallback: string): string => {
    try {
        const stored = localStorage.getItem(key);
        return stored ?? fallback;
    } catch (e) {
        console.error(`Failed to read from localStorage: ${key}`, e);
        return fallback;
    }
};

export const MemeGenerator: React.FC<MemeGeneratorProps> = ({ onMemeGenerated }) => {
  const [topText, setTopText] = useState(() => getStoredSetting('odinary_topText', ''));
  const [bottomText, setBottomText] = useState(() => getStoredSetting('odinary_bottomText', ''));
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState(() => {
    const stored = getStoredSetting('odinary_selectedTemplateUrl', memeTemplates[0].url);
    // Validate that the stored template still exists in our list
    return memeTemplates.some(t => t.url === stored) ? stored : memeTemplates[0].url;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<React.ReactNode | null>(null);
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  
  // Use localStorage for color persistence with validation
  const [textColor, setTextColor] = useState(() => {
    const stored = getStoredSetting('odinary_textColor', '#F2F2F2');
    return /^#[0-9A-F]{6}$/i.test(stored) ? stored : '#F2F2F2';
  });
  const [outlineColor, setOutlineColor] = useState(() => {
    const stored = getStoredSetting('odinary_outlineColor', '#101010');
    return /^#[0-9A-F]{6}$/i.test(stored) ? stored : '#101010';
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Effects to save all settings to localStorage on change
  useEffect(() => { try { localStorage.setItem('odinary_topText', topText); } catch (e) { console.error('Failed to save topText', e); } }, [topText]);
  useEffect(() => { try { localStorage.setItem('odinary_bottomText', bottomText); } catch (e) { console.error('Failed to save bottomText', e); } }, [bottomText]);
  useEffect(() => { try { localStorage.setItem('odinary_selectedTemplateUrl', selectedTemplateUrl); } catch (e) { console.error('Failed to save selectedTemplateUrl', e); } }, [selectedTemplateUrl]);
  useEffect(() => { try { localStorage.setItem('odinary_textColor', textColor); } catch (e) { console.error('Failed to save textColor', e); } }, [textColor]);
  useEffect(() => { try { localStorage.setItem('odinary_outlineColor', outlineColor); } catch (e) { console.error('Failed to save outlineColor', e); } }, [outlineColor]);
  
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedTemplateUrl;
    img.onload = () => setTemplateImage(img);
    img.onerror = () => setTemplateImage(null); // Handle image load errors
  }, [selectedTemplateUrl]);
  
  const drawMeme = useCallback(() => {
      const canvas = canvasRef.current;
      const templateImg = templateImage;
      if (!canvas || !templateImg || !templateImg.complete) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Background
      ctx.fillStyle = '#101010';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Template Image (fit and center)
      const hRatio = rect.width / templateImg.width;
      const vRatio = rect.height / templateImg.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (rect.width - templateImg.width * ratio) / 2;
      const centerShift_y = (rect.height - templateImg.height * ratio) / 2;
      ctx.drawImage(templateImg, 0, 0, templateImg.width, templateImg.height, centerShift_x, centerShift_y, templateImg.width * ratio, templateImg.height * ratio);

      const getLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
          const words = text.toUpperCase().split(' ');
          if (!words.length || (words.length === 1 && words[0] === '')) return [];

          const lines: string[] = [];
          let currentLine = '';

          for (const word of words) {
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              const metrics = ctx.measureText(testLine);
              if (metrics.width > maxWidth && currentLine !== '') {
                  lines.push(currentLine);
                  currentLine = word;
              } else {
                  currentLine = testLine;
              }
          }
          lines.push(currentLine);
          return lines;
      };

      const drawTextWithLayout = (text: string, position: 'top' | 'bottom') => {
          if (!text) return;

          const padding = rect.width * 0.05;
          const maxWidth = rect.width - (padding * 2);
          const maxHeight = rect.height * 0.4; // Max 40% of canvas height for text
          
          let fontSize = Math.floor(rect.width / 8);
          let lines: string[] = [];
          let lineHeight = 0;

          while (fontSize > 10) {
              ctx.font = `bold ${fontSize}px Anton, sans-serif`;
              const currentLines = getLines(ctx, text, maxWidth);
              lineHeight = fontSize * 1.2;
              if ((currentLines.length * lineHeight) <= maxHeight) {
                  lines = currentLines;
                  break;
              }
              fontSize -= 2;
          }
          if (lines.length === 0) {
              fontSize = 10;
              ctx.font = `bold ${fontSize}px Anton, sans-serif`;
              lines = getLines(ctx, text, maxWidth);
              lineHeight = fontSize * 1.2;
          }

          ctx.font = `bold ${fontSize}px Anton, sans-serif`;
          ctx.strokeStyle = outlineColor;
          ctx.fillStyle = textColor;
          ctx.lineWidth = Math.max(fontSize / 8, 2);
          ctx.textAlign = 'center';
          
          const totalTextHeight = lines.length * lineHeight;

          if (position === 'top') {
              ctx.textBaseline = 'top';
              const startY = padding;
              lines.forEach((line, index) => {
                  const y = startY + (index * lineHeight);
                  ctx.strokeText(line, rect.width / 2, y);
                  ctx.fillText(line, rect.width / 2, y);
              });
          } else { // bottom
              ctx.textBaseline = 'bottom';
              const startY = rect.height - padding - totalTextHeight + lineHeight;
              lines.forEach((line, index) => {
                  const y = startY + (index * lineHeight);
                  ctx.strokeText(line, rect.width / 2, y);
                  ctx.fillText(line, rect.width / 2, y);
              });
          }
      };
      
      drawTextWithLayout(topText, 'top');
      drawTextWithLayout(bottomText, 'bottom');
      
      // Watermark
      const shortHash = createShortHash(topText, bottomText);
      const watermarkText = `ODINARY • ${shortHash}`;
      ctx.font = `bold ${Math.max(rect.width/40, 10)}px Poppins`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(watermarkText, rect.width - 10, rect.height - 10);
  }, [topText, bottomText, templateImage, textColor, outlineColor]);

  useEffect(() => {
    const renderCanvas = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => {
        drawMeme();
      });
    };

    renderCanvas(); // Render when dependencies change

    window.addEventListener('resize', renderCanvas);

    return () => {
      window.removeEventListener('resize', renderCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [drawMeme]);


  const handleGenerateAndSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
        setError("Canvas element not found. Please refresh the page.");
        return;
    }
    if (!topText && !bottomText) {
        setError("Please add some text to your meme before saving.");
        return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
        let imageUrl: string;
        try {
            imageUrl = canvas.toDataURL('image/png');
        } catch (e) {
            console.error("Canvas export failed", e);
            throw new Error("Security Error: Unable to export image. The selected template may not support secure export (CORS). Try a different template.");
        }

        const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

        if (!blob) {
            throw new Error('Unable to package meme for download. Please try again.');
        }

        const shortHash = createShortHash(topText, bottomText);
        const watermarkText = `ODINARY • ${shortHash}`;
        const fileName = `odinary-${shortHash.toLowerCase()}.png`;

        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = fileName;
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(downloadUrl);

        const newMeme: Meme = {
            id: `meme-${Date.now()}`,
            imageUrl,
            caption: `${topText} ${bottomText}`.trim(),
            score: 0,
            shareCount: 0,
            minted: false,
            prompt: `Template: ${memeTemplates.find(t => t.url === selectedTemplateUrl)?.name || 'Custom'}`,
            watermark: watermarkText,
        };

        onMemeGenerated(newMeme);

        setSuccessMessage(
            <>Saved <span className="font-semibold">{fileName}</span> locally and added it to your feed.</>
        );
        setTimeout(() => setSuccessMessage(null), 4000);

    } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRandomizeTemplate = () => {
    // Get all templates except the current one
    const availableTemplates = memeTemplates.filter(t => t.url !== selectedTemplateUrl);
    // If all templates are the same or only one exists, pick from all; otherwise, pick from the filtered list.
    const templatesToPickFrom = availableTemplates.length > 0 ? availableTemplates : memeTemplates;
    const randomIndex = Math.floor(Math.random() * templatesToPickFrom.length);
    const randomTemplate = templatesToPickFrom[randomIndex];
    setSelectedTemplateUrl(randomTemplate.url);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`I'm creating a meme on ODINARY! Check it out. #Odinary #NARY $NARY`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const commonInputClasses = "w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red transition-shadow";

  return (
    <div className="glass-effect p-4 sm:p-6 mb-8 shadow-lg">
      <h2 className="font-header text-3xl font-bold text-neutral-200 mb-6 flex items-center gap-3">
          <MagicWandIcon className="w-8 h-8 text-brand-red" style={{ filter: 'drop-shadow(0 0 5px var(--brand-red-glow))' }}/>
          <span>Create Meme</span>
      </h2>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
        
        {/* Right Side: Canvas Preview (Ordered 1st on Mobile, 2nd on Desktop) */}
        <div className="order-1 lg:order-2 flex flex-col">
            <div className="flex justify-between items-center mb-2 lg:hidden">
                <span className="text-sm font-semibold text-brand-orange uppercase tracking-wider">Live Preview</span>
            </div>
            <div className="aspect-square bg-black/30 rounded-lg p-2 group overflow-hidden shadow-2xl border border-white/5 relative">
                <canvas ref={canvasRef} className="w-full h-full rounded-md object-contain" />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
                Preview updates in real-time
            </p>
        </div>

        {/* Left Side: Controls (Ordered 2nd on Mobile, 1st on Desktop) */}
        <div className="order-2 lg:order-1 flex flex-col gap-5">
            <div className="space-y-4">
                <div>
                    <label htmlFor="template-select" className="block text-sm font-medium text-gray-400 mb-1">Template</label>
                    <select
                        id="template-select"
                        value={selectedTemplateUrl}
                        onChange={(e) => setSelectedTemplateUrl(e.target.value)}
                        className={commonInputClasses}
                    >
                        {memeTemplates.map(template => (
                            <option key={template.id} value={template.url}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="top-text" className="block text-sm font-medium text-gray-400 mb-1">Top Text</label>
                    <input id="top-text" type="text" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="e.g., 'They don't know...'" className={commonInputClasses} />
                </div>
                <div>
                    <label htmlFor="bottom-text" className="block text-sm font-medium text-gray-400 mb-1">Bottom Text</label>
                    <input id="bottom-text" type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="...I'm using ODINARY'" className={commonInputClasses} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="text-color" className="block text-sm font-medium text-gray-400 mb-1">Text Color</label>
                        <input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-12 p-1 bg-slate-900/70 border border-slate-700 rounded-lg cursor-pointer" />
                    </div>
                    <div>
                        <label htmlFor="outline-color" className="block text-sm font-medium text-gray-400 mb-1">Outline Color</label>
                        <input id="outline-color" type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)} className="w-full h-12 p-1 bg-slate-900/70 border border-slate-700 rounded-lg cursor-pointer" />
                    </div>
                </div>
            </div>
            
            <div className="pt-4 border-t border-glass-border flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleGenerateAndSave}
                  disabled={isSaving}
                  className="w-full sm:flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/20 hover:shadow-red-700/40 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                >
                  {isSaving ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : 'Download Meme'}
                </button>
                <button 
                  onClick={handleRandomizeTemplate}
                  className="w-full sm:flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                    <MagicWandIcon className="w-5 h-5"/>
                    <span>Randomize</span>
                </button>
                 <button onClick={handleShare} className="w-full sm:flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-5 rounded-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"><XIcon className="w-4 h-4" /> Share</button>
            </div>
            
            {/* Error/Success Messages */}
            <div className="min-h-[3.5rem] flex items-center justify-center">
                {error && (
                    <div className="w-full flex items-center justify-between bg-red-900/50 text-red-300 p-3 rounded-lg animate-fade-in">
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="text-red-300 hover:text-white transition-colors" aria-label="Dismiss error">
                        <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {successMessage && (
                     <div className="w-full text-center bg-green-900/50 text-green-300 p-3 rounded-lg animate-fade-in-out font-medium text-sm">
                        {successMessage}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 text-center -mt-2">Downloading saves a PNG locally. Sharing opens a pre-filled tweet.</p>
        </div>
      </div>
    </div>
  );
};
