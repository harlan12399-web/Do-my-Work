import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Loader2,
  ClipboardPaste,
} from 'lucide-react';

interface WorksheetUploaderProps {
  onSolve: (payload: { textPrompt: string }) => void;
  isSolving: boolean;
  onToast: (msg: string) => void;
  accentColor?: string;
}

export const WorksheetUploader: React.FC<WorksheetUploaderProps> = ({
  onSolve,
  isSolving,
  onToast,
  accentColor = '#ff7a3d',
}) => {
  const [textPrompt, setTextPrompt] = useState('');

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTextPrompt(text);
        onToast('Questions pasted from clipboard');
      } else {
        onToast('Clipboard is empty');
      }
    } catch (err) {
      onToast('Use Ctrl+V or Cmd+V to paste');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textPrompt.trim()) {
      onToast('Please enter your worksheet questions');
      return;
    }

    onSolve({ textPrompt: textPrompt.trim() });
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-center">
      {/* Main Minimalist Text Worksheet Box */}
      <div className="relative rounded-2xl bg-[#0d0d10] border border-white/10 p-5 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header of Card */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white tracking-wide">
                Worksheet Questions
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] text-[11px] text-[#8a8780] hover:text-white transition-all flex items-center gap-1.5"
          >
            <ClipboardPaste className="w-3 h-3" />
            <span>Paste from Clipboard</span>
          </button>
        </div>

        {/* Text Area */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Paste your questions or problems here...&#10;&#10;1. Solve for x: 3x² - 12x + 9 = 0&#10;2. What is the net yield of ATP produced during cellular respiration?&#10;3. Name James Watt's key technological innovation in 1776."
              rows={7}
              autoFocus
              className="w-full p-4 text-xs md:text-sm text-white bg-black/40 border border-white/10 focus:border-white/30 rounded-xl outline-none font-mono leading-relaxed transition-all placeholder:text-[#4a4845] resize-none h-[180px] md:h-[200px]"
            />

            {textPrompt.trim() && (
              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#5c5a56]">
                {textPrompt.split('\n').filter((l) => l.trim()).length} lines
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="text-[11px] text-[#8a8780] font-light">
              <span>Full solutions stamped with your student name and grade</span>
            </div>

            <button
              type="submit"
              disabled={isSolving || !textPrompt.trim()}
              className="px-7 py-3 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: accentColor }}
            >
              {isSolving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Solving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complete Worksheet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
