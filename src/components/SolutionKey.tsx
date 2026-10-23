import React, { useState } from 'react';
import { SolvedWorksheetData, SolvedItem } from '../types.ts';
import {
  Copy,
  Check,
  Sparkles,
  FileText,
  Printer,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface SolutionKeyProps {
  data: SolvedWorksheetData;
  activeItemId?: number | null;
  onSelectItem?: (item: SolvedItem) => void;
  onToast: (msg: string) => void;
}

export const SolutionKey: React.FC<SolutionKeyProps> = ({
  data,
  activeItemId,
  onSelectItem,
  onToast,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<number | null>(null);

  // Copy all answers formatted cleanly
  const handleCopyAll = async () => {
    try {
      const text =
        data.formattedCopyText ||
        data.items
          .map((item) => `${item.questionNumber || item.id}. ${item.answer}`)
          .join('\n');

      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      onToast('All answers copied to clipboard!');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      onToast('Failed to copy. Please copy manually.');
    }
  };

  // Copy single answer
  const handleCopyItem = async (e: React.MouseEvent, item: SolvedItem) => {
    e.stopPropagation();
    try {
      const text = `${item.questionNumber || item.id}. ${item.answer}`;
      await navigator.clipboard.writeText(text);
      setCopiedItemId(item.id);
      onToast(`Answer for ${item.questionNumber || `#${item.id}`} copied!`);
      setTimeout(() => setCopiedItemId(null), 1500);
    } catch (err) {
      onToast('Failed to copy.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0d0d10] border border-white/10 overflow-hidden shadow-2xl">
      {/* Header with Title and Big Copy Button */}
      <div className="p-5 md:p-6 bg-[#131317] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#ff7a3d] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Completed Solution Key</span>
          </div>
          <h3 className="font-serif-italic text-xl md:text-2xl text-white">
            {data.title}
          </h3>
          <p className="text-xs text-[#8a8780] mt-0.5">
            {data.subject} · {data.items.length} Questions Answered
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
              copiedAll
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-[#ff7a3d] hover:bg-[#ff8e58] text-black shadow-[#ff7a3d]/20'
            }`}
            title="Copy all answers formatted for instant pasting"
          >
            {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy All Answers'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] text-[#8a8780] hover:text-white transition-all"
            title="Print clean solution key"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions & Solutions List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5">
        {data.items.map((item, idx) => {
          const isSelected = activeItemId === item.id;
          const isItemCopied = copiedItemId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem?.(item)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#ff7a3d]/60 bg-[#ff7a3d]/[0.05] shadow-[0_0_20px_rgba(255,122,61,0.1)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center font-mono text-xs text-[#c9bfa8] font-bold">
                    {item.questionNumber || idx + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm text-[#e8e6e1] font-medium leading-relaxed">
                      {item.questionText}
                    </p>
                  </div>
                </div>

                {/* Copy single answer button */}
                <button
                  onClick={(e) => handleCopyItem(e, item)}
                  className={`p-1.5 rounded-lg border text-xs transition-all opacity-80 group-hover:opacity-100 ${
                    isItemCopied
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/10 hover:border-white/20 bg-white/[0.02] text-[#8a8780] hover:text-white'
                  }`}
                  title="Copy this answer"
                >
                  {isItemCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Definitive Answer Box */}
              <div className="mt-3.5 pl-10">
                <div className="p-3 rounded-lg border border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#ff7a3d] font-bold">
                      Answer:
                    </span>
                    <span className="font-mono text-sm md:text-base font-bold text-white select-all">
                      {item.answer}
                    </span>
                  </div>
                  {item.workings && (
                    <span className="text-[11px] text-[#8a8780] italic">
                      {item.workings}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="px-5 py-3 bg-[#09090b] border-t border-white/5 flex items-center justify-between text-xs text-[#8a8780]">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#ff7a3d]" />
          <span>Need adjustments? Re-solve or edit instructions anytime.</span>
        </span>
        <button
          onClick={handleCopyAll}
          className="text-[#e8e6e1] hover:text-white hover:underline transition-colors font-medium"
        >
          Copy all answers (plain text)
        </button>
      </div>
    </div>
  );
};
