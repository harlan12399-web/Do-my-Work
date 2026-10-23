import React, { useState } from 'react';
import { SolvedWorksheetData, SolvedItem, UserProfile } from '../types.ts';
import {
  Copy,
  Check,
  ArrowLeft,
  Volume2,
  VolumeX,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface CompletedWorksheetBoxProps {
  data: SolvedWorksheetData;
  rawText?: string;
  profile: UserProfile;
  onBack: () => void;
  onToast: (msg: string) => void;
}

export const CompletedWorksheetBox: React.FC<CompletedWorksheetBoxProps> = ({
  data,
  profile,
  onBack,
  onToast,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFullDoc, setCopiedFullDoc] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const todayDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const accentColor = profile.gender === 'girl' ? '#ff6b9d' : '#ff7a3d';

  // 1-Click Copy All Answers
  const handleCopyAllAnswers = async () => {
    try {
      const text =
        data.formattedCopyText ||
        data.items.map((it) => `${it.questionNumber || it.id}. ${it.answer}`).join('\n');

      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      onToast('All answers copied to clipboard');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      onToast('Unable to copy automatically');
    }
  };

  // Copy Full Document Block
  const handleCopyFullDoc = async () => {
    try {
      const fullDoc = `=== ${data.title.toUpperCase()} ===
Student: ${profile.name || 'Scholar'} · ${profile.yearGroup || 'Year 11'} · Harlan Presents Do My Work
Date: ${todayDate}

${data.items
  .map(
    (it) =>
      `[${it.questionNumber || it.id}] ${it.questionText}\nANSWER: ${it.answer}${
        it.workings ? `\nWorkings: ${it.workings}` : ''
      }`
  )
  .join('\n\n')}

Verified by Do My Work AI`;

      await navigator.clipboard.writeText(fullDoc);
      setCopiedFullDoc(true);
      onToast('Full answered worksheet text copied');
      setTimeout(() => setCopiedFullDoc(false), 2000);
    } catch (e) {
      onToast('Unable to copy text');
    }
  };

  // Copy single question answer
  const handleCopyItem = async (it: SolvedItem) => {
    try {
      await navigator.clipboard.writeText(`${it.questionNumber || it.id}. ${it.answer}`);
      setCopiedItemId(it.id);
      onToast(`Answer #${it.questionNumber || it.id} copied`);
      setTimeout(() => setCopiedItemId(null), 1500);
    } catch (e) {
      onToast('Failed to copy');
    }
  };

  // Audio Read Aloud
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      onToast('Text-to-speech not supported');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const speechText = `Completed answers for ${data.title}. ${data.items
      .map((it) => `Question ${it.questionNumber || it.id}: ${it.answer}.`)
      .join(' ')}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    onToast('Reading answers aloud...');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-300 overflow-hidden select-none">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 shrink-0">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] text-xs font-medium text-[#8a8780] hover:text-white transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Solve Another</span>
        </button>

        {/* Action Buttons: 1-Click Copy All */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAllAnswers}
            className="px-4 py-2 rounded-xl text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            style={{ backgroundColor: accentColor }}
            title="Copy all answers to clipboard (Key: C)"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied' : 'Copy All Answers'}</span>
          </button>

          <button
            onClick={handleCopyFullDoc}
            className="px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] text-[#8a8780] hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            title="Copy full document text block"
          >
            {copiedFullDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedFullDoc ? 'Copied Block' : 'Copy Block'}</span>
          </button>

          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-xl border transition-all ${
              isPlayingAudio
                ? 'border-white/40 bg-white/10 text-white'
                : 'border-white/10 hover:border-white/20 bg-white/[0.02] text-[#8a8780] hover:text-white'
            }`}
            title="Read answers aloud"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* THE COMPLETED ANSWERED WORKSHEET IN CLEAN OBSIDIAN TEXT BOX */}
      <div className="relative flex-1 flex flex-col rounded-2xl bg-[#0d0d10] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-5 md:p-7 overflow-hidden min-h-0">
        {/* Header Block inside the Card */}
        <div className="pb-4 border-b border-white/10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase mb-1 border"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderColor: `${accentColor}30`,
                  color: accentColor,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>COMPLETED WORKSHEET</span>
              </div>
              <h2 className="font-serif-italic text-xl md:text-2xl text-white font-semibold leading-tight">
                {data.title}
              </h2>
              <p className="text-[11px] text-[#8a8780]">
                {data.subject} · {data.items.length} Questions Answered
              </p>
            </div>

            {/* Student Metadata Tag */}
            <div className="px-3.5 py-2 rounded-xl border border-white/10 bg-black/40 text-xs space-y-0.5 min-w-[200px]">
              <div className="flex items-center justify-between text-[#8a8780] text-[10px]">
                <span>Student:</span>
                <span className="text-white font-medium">{profile.name || 'Scholar'}</span>
              </div>
              <div className="flex items-center justify-between text-[#8a8780] text-[10px]">
                <span>Grade / Level:</span>
                <span className="text-white font-medium">{profile.yearGroup || 'Year 11'}</span>
              </div>
              <div className="flex items-center justify-between text-[#8a8780] text-[10px]">
                <span>Date:</span>
                <span className="text-white font-medium">{todayDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answered Questions Block (Sleek scrollable list, stays within viewport!) */}
        <div className="pt-4 space-y-4 flex-1 overflow-y-auto pr-2">
          {data.items.map((item, idx) => {
            const isCopied = copiedItemId === item.id;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors space-y-2 group"
              >
                {/* Question Statement */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="font-mono text-xs font-bold px-1.5 py-0.5 rounded border border-white/10 bg-black/40"
                      style={{ color: accentColor }}
                    >
                      {item.questionNumber ? `${item.questionNumber}` : `${idx + 1}`}
                    </span>
                    <p className="text-xs md:text-sm text-white font-medium leading-relaxed pt-0.5">
                      {item.questionText}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyItem(item)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded border text-[10px] ${
                      isCopied
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 opacity-100'
                        : 'border-white/10 hover:border-white/20 text-[#8a8780] hover:text-white'
                    }`}
                    title="Copy this answer"
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* Direct Answer Box */}
                <div className="pl-7 space-y-1">
                  <div
                    onClick={() => handleCopyItem(item)}
                    className="p-2.5 rounded-lg border border-white/10 bg-black/50 flex items-center justify-between gap-2 cursor-pointer hover:border-white/20 transition-all select-all"
                  >
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-[10px] tracking-widest uppercase font-bold"
                        style={{ color: accentColor }}
                      >
                        Answer:
                      </span>
                      <span className="font-mono text-sm md:text-base font-bold text-white">
                        {item.answer}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#5c5a56] font-mono group-hover:text-[#8a8780] transition-colors">
                      click to copy
                    </span>
                  </div>

                  {/* Workings / Steps */}
                  {item.workings && (
                    <div className="text-[11px] text-[#8a8780] font-mono pl-1 pt-0.5">
                      <span className="text-[#5c5a56] not-italic">Work: </span>
                      <span>{item.workings}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer inside card */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#5c5a56] shrink-0">
          <span>Harlan Presents · Do My Work</span>
          <span className="font-mono">All questions verified</span>
        </div>
      </div>
    </div>
  );
};
