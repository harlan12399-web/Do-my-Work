import React, { useState, useRef, useEffect } from 'react';
import { SolvedWorksheetData, SolvedItem } from '../types.ts';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  PenTool,
  Type as TypeIcon,
  CheckCircle2,
} from 'lucide-react';

interface VisualWorksheetViewerProps {
  imageUrl: string;
  data: SolvedWorksheetData;
  activeItemId?: number | null;
  onSelectItem?: (item: SolvedItem) => void;
  onToast: (msg: string) => void;
}

export const VisualWorksheetViewer: React.FC<VisualWorksheetViewerProps> = ({
  imageUrl,
  data,
  activeItemId,
  onSelectItem,
  onToast,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showAnswers, setShowAnswers] = useState(true);
  const [inkStyle, setInkStyle] = useState<'handwritten' | 'print'>('handwritten');
  const [inkColor, setInkColor] = useState<'blue' | 'black' | 'amber'>('blue');
  const [isExporting, setIsExporting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const colorMap = {
    blue: {
      text: '#1d4ed8',
      bg: 'rgba(239, 246, 255, 0.92)',
      border: 'rgba(59, 130, 246, 0.4)',
    },
    black: {
      text: '#0f172a',
      bg: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(15, 23, 42, 0.3)',
    },
    amber: {
      text: '#c2410c',
      bg: 'rgba(255, 247, 237, 0.92)',
      border: 'rgba(249, 115, 22, 0.4)',
    },
  }[inkColor];

  // Reset zoom on image change
  useEffect(() => {
    setZoom(1);
  }, [imageUrl]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.5, Math.max(0.6, Number((prev + delta).toFixed(1)))));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Download completed worksheet with stamped answers using HTML5 Canvas
  const handleDownloadCompletedSheet = async () => {
    if (!imageRef.current) return;
    setIsExporting(true);
    onToast('Preparing high-resolution completed sheet...');

    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      // Native image dimensions
      canvas.width = img.naturalWidth || img.width || 1200;
      canvas.height = img.naturalHeight || img.height || 1600;

      // Draw base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (showAnswers) {
        // Draw answers on canvas
        data.items.forEach((item, index) => {
          let x = 0;
          let y = 0;

          if (item.box && typeof item.box.xmin === 'number' && typeof item.box.ymin === 'number') {
            x = (item.box.xmin / 1000) * canvas.width;
            y = (item.box.ymin / 1000) * canvas.height;
          } else {
            // Default calculated position along lines
            x = canvas.width * 0.16;
            y = canvas.height * 0.22 + index * (canvas.height * 0.16);
          }

          // Draw small background pill
          const text = item.answer;
          ctx.font = inkStyle === 'handwritten' ? 'bold 26px Caveat, cursive' : 'bold 20px system-ui, sans-serif';
          const metrics = ctx.measureText(text);
          const paddingX = 14;
          const paddingY = 8;
          const boxW = metrics.width + paddingX * 2;
          const boxH = 36;

          ctx.fillStyle = inkColor === 'blue' ? 'rgba(239, 246, 255, 0.9)' : inkColor === 'amber' ? 'rgba(255, 247, 237, 0.9)' : 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = inkColor === 'blue' ? '#3b82f6' : inkColor === 'amber' ? '#f97316' : '#64748b';
          ctx.lineWidth = 1.5;

          // Round rect
          ctx.beginPath();
          ctx.roundRect(x, y - boxH + 8, boxW, boxH, 8);
          ctx.fill();
          ctx.stroke();

          // Text
          ctx.fillStyle = inkColor === 'blue' ? '#1d4ed8' : inkColor === 'amber' ? '#c2410c' : '#0f172a';
          ctx.fillText(text, x + paddingX, y - 4);
        });
      }

      // Convert to download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Completed_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onToast('Completed worksheet downloaded!');
    } catch (err) {
      console.error(err);
      onToast('Download failed. Please try saving as image.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0d0d10] border border-white/10 overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#131317] border-b border-white/10 text-xs">
        {/* Left: View & Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-medium ${
              showAnswers
                ? 'border-[#ff7a3d]/50 bg-[#ff7a3d]/10 text-white'
                : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:text-white'
            }`}
            title="Toggle completed answers visibility"
          >
            {showAnswers ? <Eye className="w-3.5 h-3.5 text-[#ff7a3d]" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAnswers ? 'Answers Shown' : 'Original Sheet'}</span>
          </button>

          {/* Ink Style toggle */}
          <div className="flex items-center border border-white/10 rounded-lg p-0.5 bg-black/30">
            <button
              onClick={() => setInkStyle('handwritten')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                inkStyle === 'handwritten' ? 'bg-white/15 text-white font-medium' : 'text-[#8a8780] hover:text-white'
              }`}
              title="Handwritten style answers"
            >
              <PenTool className="w-3 h-3" />
              <span className="hidden sm:inline">Handwritten</span>
            </button>
            <button
              onClick={() => setInkStyle('print')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                inkStyle === 'print' ? 'bg-white/15 text-white font-medium' : 'text-[#8a8780] hover:text-white'
              }`}
              title="Clean printed style answers"
            >
              <TypeIcon className="w-3 h-3" />
              <span className="hidden sm:inline">Printed</span>
            </button>
          </div>

          {/* Ink Color picker */}
          <div className="flex items-center gap-1.5 pl-1">
            {[
              { id: 'blue', color: '#3b82f6', title: 'Blue Ink' },
              { id: 'black', color: '#0f172a', title: 'Graphite Ink' },
              { id: 'amber', color: '#f97316', title: 'Amber Red Ink' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setInkColor(c.id as any)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  inkColor === c.id ? 'scale-125 border-white ring-2 ring-white/20' : 'border-white/30 hover:scale-110'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.title}
              />
            ))}
          </div>
        </div>

        {/* Right: Zoom & Download */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-white/10 rounded-lg p-0.5 bg-black/30 text-[#8a8780]">
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1.5 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] min-w-[38px] text-center text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1.5 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:text-white transition-colors border-l border-white/10"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleDownloadCompletedSheet}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all font-medium active:scale-95 disabled:opacity-50"
            title="Download the completed worksheet with all answers filled in"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Image</span>
          </button>
        </div>
      </div>

      {/* Main Canvas / Image Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-[#09090b]/80 min-h-[420px]"
      >
        <div
          className="relative transition-transform duration-200 origin-top shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 rounded-lg overflow-hidden bg-white"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Base Worksheet Image */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Worksheet"
            className="block max-w-[800px] w-full h-auto select-none pointer-events-none"
            crossOrigin="anonymous"
          />

          {/* Overlaid Completed Answers */}
          {showAnswers && (
            <div className="absolute inset-0 pointer-events-auto">
              {data.items.map((item, index) => {
                // If bounding box coordinates exist from Gemini, use them;
                // Otherwise use default distributed layout matching typical worksheet lines
                let topPct = 0;
                let leftPct = 0;

                if (item.box && typeof item.box.ymin === 'number' && typeof item.box.xmin === 'number') {
                  topPct = (item.box.ymin / 1000) * 100;
                  leftPct = (item.box.xmin / 1000) * 100;
                } else {
                  topPct = 21 + index * 15.5;
                  leftPct = 14;
                }

                const isSelected = activeItemId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem?.(item)}
                    className={`absolute cursor-pointer transition-all duration-200 select-none ${
                      isSelected ? 'ring-2 ring-[#ff7a3d] scale-105 z-30' : 'hover:scale-105 z-20'
                    }`}
                    style={{
                      top: `${topPct}%`,
                      left: `${leftPct}%`,
                      transform: 'translate(0, -25%)',
                    }}
                    title={`Click to inspect solution for ${item.questionNumber || `#${index + 1}`}`}
                  >
                    <div
                      className={`px-3 py-1 rounded-md shadow-md border flex items-center gap-1.5 ${
                        inkStyle === 'handwritten'
                          ? 'font-handwriting text-xl tracking-wide font-bold'
                          : 'font-mono-tabular text-sm font-semibold'
                      }`}
                      style={{
                        color: colorMap.text,
                        backgroundColor: colorMap.bg,
                        borderColor: colorMap.border,
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 opacity-70 shrink-0" />
                      <span>{item.answer}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="px-4 py-2 bg-[#09090b] border-t border-white/5 flex items-center justify-between text-[11px] text-[#8a8780]">
        <span>
          Showing {data.items.length} completed answer{data.items.length === 1 ? '' : 's'}. Click any answer to view steps.
        </span>
        <span className="font-serif-italic text-[#c9bfa8] hidden sm:inline">
          {data.subject} · {data.title}
        </span>
      </div>
    </div>
  );
};
