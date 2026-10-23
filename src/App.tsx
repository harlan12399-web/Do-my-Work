/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BackgroundScene } from './components/BackgroundScene.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { VipModal } from './components/VipModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { SettingsDrawer } from './components/SettingsDrawer.tsx';
import { CompletedWorksheetBox } from './components/CompletedWorksheetBox.tsx';
import { IntroTrailer } from './components/IntroTrailer.tsx';
import { LineArtSolvingOverlay } from './components/LineArtSolvingOverlay.tsx';
import {
  UserProfile,
  SolvedWorksheetData,
  WorksheetSession,
  DAILY_LIMIT,
} from './types.ts';
import {
  Sparkles,
  ArrowRight,
  ClipboardPaste,
} from 'lucide-react';

const PROFILE_STORAGE_KEY = 'do_my_work_profile_v6';
const USAGE_STORAGE_KEY = 'do_my_work_daily_usage_v6';
const HISTORY_STORAGE_KEY = 'do_my_work_history_v6';
const VIP_PROMPTED_KEY = 'do_my_work_vip_prompted_v6';
const TRAILER_SEEN_KEY = 'harlan_trailer_seen_v7';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      name: 'Scholar',
      age: 16,
      gender: 'boy',
      yearGroup: 'Year 11',
      celestial: 'auto',
      isVip: false,
      onboardingCompleted: false,
    };
  });

  const [dailyCount, setDailyCount] = useState<number>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const stored = localStorage.getItem(USAGE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) return parsed.count;
      }
    } catch (e) {}
    return 0;
  });

  const [history, setHistory] = useState<WorksheetSession[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  const [textPrompt, setTextPrompt] = useState('');
  const [currentSession, setCurrentSession] = useState<WorksheetSession | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solvingPhase, setSolvingPhase] = useState('');

  const [showTrailer, setShowTrailer] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(TRAILER_SEEN_KEY);
    } catch (e) {
      return false;
    }
  });

  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    document.body.dataset.gender = profile.gender;
  }, [profile.gender]);

  const updateProfile = useCallback((updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const incrementDailyCount = useCallback(() => {
    setDailyCount((prev) => {
      const next = prev + 1;
      try {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify({ date: today, count: next }));
      } catch (e) {}
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  }, []);

  const handleTrailerComplete = () => {
    setShowTrailer(false);
    try {
      localStorage.setItem(TRAILER_SEEN_KEY, 'true');
    } catch (e) {}

    const hasSeenVipPrompt = localStorage.getItem(VIP_PROMPTED_KEY);
    if (!profile.isVip && !hasSeenVipPrompt) {
      setTimeout(() => {
        setIsVipModalOpen(true);
        localStorage.setItem(VIP_PROMPTED_KEY, 'true');
      }, 500);
    } else if (!profile.onboardingCompleted) {
      setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 400);
    }
  };

  useEffect(() => {
    if (!showTrailer) {
      const hasSeenVipPrompt = localStorage.getItem(VIP_PROMPTED_KEY);
      if (!profile.isVip && !hasSeenVipPrompt) {
        const timer = setTimeout(() => {
          setIsVipModalOpen(true);
          localStorage.setItem(VIP_PROMPTED_KEY, 'true');
        }, 700);
        return () => clearTimeout(timer);
      } else if (!profile.onboardingCompleted) {
        const timer = setTimeout(() => {
          setIsOnboardingOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [showTrailer, profile.isVip, profile.onboardingCompleted]);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    let raf: number;
    const handleMove = (e: PointerEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--px', px.toFixed(3));
        document.documentElement.style.setProperty('--py', py.toFixed(3));
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      clearInterval(clockInterval);
      window.removeEventListener('pointermove', handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        setIsVipModalOpen(false);
        setIsOnboardingOpen(false);
        setIsSettingsOpen(false);
      } else if (e.key.toLowerCase() === 's') {
        setIsSettingsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        setIsFocusMode((prev) => !prev);
        showToast(!isFocusMode ? 'Focus mode enabled' : 'Focus mode disabled');
      } else if (e.key.toLowerCase() === 'c' && currentSession?.data) {
        const text =
          currentSession.data.formattedCopyText ||
          currentSession.data.items
            .map((item) => `${item.questionNumber || item.id}. ${item.answer}`)
            .join('\n');
        navigator.clipboard.writeText(text);
        showToast('All answers copied to clipboard!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSession, isFocusMode, showToast]);

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textPrompt.trim()) {
      showToast('Please enter your worksheet questions');
      return;
    }

    if (!profile.isVip && dailyCount >= DAILY_LIMIT) {
      showToast('Daily limit reached (15/15). Enter your VIP code to continue.');
      setIsVipModalOpen(true);
      return;
    }

    setIsSolving(true);
    setSolvingPhase('Analyzing worksheet problem statements...');

    const t1 = setTimeout(() => {
      setSolvingPhase('Formulating academic solutions with Gemini...');
    }, 1100);
    const t2 = setTimeout(() => {
      setSolvingPhase(`Stamping answers for ${profile.name} (${profile.yearGroup})...`);
    }, 2200);

    try {
      const res = await fetch('/api/solve-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textPrompt: textPrompt.trim(),
          studentName: profile.name,
          studentAge: profile.age,
          studentYear: profile.yearGroup,
          studentGender: profile.gender,
        }),
      });

      clearTimeout(t1);
      clearTimeout(t2);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to solve worksheet.');
      }

      const solvedData: SolvedWorksheetData = json.data;

      const newSession: WorksheetSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        rawText: textPrompt.trim(),
        data: solvedData,
      };

      setCurrentSession(newSession);
      incrementDailyCount();

      const updatedHistory = [newSession, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (err) {}

      showToast(`Worksheet completed · ${solvedData.items.length} questions answered`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing worksheet. Please try again.');
    } finally {
      setIsSolving(false);
      setSolvingPhase('');
    }
  };

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        setTextPrompt(clip);
        showToast('Pasted from clipboard');
      }
    } catch (err) {
      showToast('Use Ctrl+V / Cmd+V to paste');
    }
  };

  const handleVipUnlocked = () => {
    updateProfile({ isVip: true });
    showToast('VIP Access Activated · Unlimited Solves Unlocked');
  };

  const remainingQuota = Math.max(0, DAILY_LIMIT - dailyCount);
  const accentColor = profile.gender === 'girl' ? '#ff6b9d' : '#ff7a3d';

  const greetingWord = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  }, []);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden flex flex-col justify-between select-none bg-[#09090b] text-[#e8e6e1] transition-colors duration-700 ${
        isFocusMode ? 'focus-mode' : ''
      }`}
    >
      {/* Intro Trailer */}
      {showTrailer && (
        <IntroTrailer onComplete={handleTrailerComplete} accentColor={accentColor} />
      )}

      {/* Atmospheric Background Scene (Flying seagulls, centered sun, horizon hills) */}
      <BackgroundScene
        celestialMode={profile.celestial}
        theme={profile.gender === 'girl' ? 'rose' : 'amber'}
      />

      {/* Fluid Precision Custom Cursor */}
      <CustomCursor />

      {/* FIXED CORNER MARK */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2.5 text-[8.5px] tracking-[0.42em] uppercase text-[#8a8780] font-medium pointer-events-none no-print">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
        />
        <span className="text-white/90 font-medium">Do My Work</span>
        <span className="pl-2 border-l border-white/10 font-mono-tabular text-[#5c5a56]">
          {currentTimeStr}
        </span>
      </div>

      {/* FIXED PROFILE BUTTON (Top Right) */}
      <div className="fixed top-5 right-6 z-50 flex items-center gap-3 no-print">
        {/* Understated Quota Pill */}
        <button
          onClick={() => setIsVipModalOpen(true)}
          className="px-3 py-1 rounded-full border text-[9.5px] font-medium tracking-[0.2em] uppercase transition-all backdrop-blur-md"
          style={{
            borderColor: profile.isVip ? `${accentColor}60` : 'rgba(255,255,255,0.08)',
            backgroundColor: profile.isVip ? `${accentColor}12` : 'rgba(255,255,255,0.02)',
            color: profile.isVip ? accentColor : '#8a8780',
          }}
          title={profile.isVip ? 'VIP Member · Unlimited' : 'Daily Quota Status'}
        >
          {profile.isVip ? (
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              <span>VIP Unlimited</span>
            </span>
          ) : (
            <span>{remainingQuota} / {DAILY_LIMIT} Solves</span>
          )}
        </button>

        {/* Profile Circle with hover hint 'S' */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="relative w-9 h-9 rounded-full border border-white/15 hover:border-white/35 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center font-serif-italic text-sm text-white transition-all shadow-sm group"
          aria-label="Open settings"
          title="Open settings (S)"
        >
          <span>{profile.name ? profile.name.charAt(0).toUpperCase() : '?'}</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#131317] border border-white/20 text-[8px] font-mono text-[#8a8780] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            S
          </span>
        </button>
      </div>

      {/* Line Art Solving Animation */}
      {isSolving && (
        <LineArtSolvingOverlay solvingPhase={solvingPhase} accentColor={accentColor} />
      )}

      {/* CENTRAL STAGE (Perfect single-page centering with breathing room above & below!) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 w-full max-w-2xl mx-auto overflow-hidden">
        {!currentSession ? (
          /* HOME STAGE: Harlan Presents Do My Work */
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500 py-1">
            {/* Harlan Presents Header */}
            <div className="flex items-center justify-center gap-3.5 mb-2 opacity-90">
              <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
              <span className="text-[8.5px] tracking-[0.45em] uppercase text-[#8a8780] font-medium text-indent-[0.45em]">
                Harlan Presents
              </span>
              <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
            </div>

            {/* Greeting */}
            <div
              className="font-serif-italic text-sm text-[#8a8780] mb-2.5 cursor-pointer hover:text-white transition-colors"
              onClick={() => setIsSettingsOpen(true)}
            >
              {greetingWord}, <span className="text-white not-italic font-sans font-medium">{profile.name || 'Scholar'}</span>.
              <span className="text-[#5c5a56] font-sans not-italic text-[10px] uppercase tracking-wider ml-1.5 font-light">
                · {profile.yearGroup}
              </span>
            </div>

            {/* Main Title: Do My Work */}
            <h1 className="font-serif-italic text-3xl md:text-5xl text-white mb-3.5 tracking-tight leading-none text-center">
              Do My Work
            </h1>

            {/* Translucent Luxury Input Box */}
            <div className="w-full relative rounded-2xl bg-[#0d0d10]/85 backdrop-blur-2xl border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 md:p-5 transition-all focus-within:border-white/20">
              <form onSubmit={handleSolve} className="space-y-3">
                <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-[#8a8780] font-medium pb-1.5 border-b border-white/[0.05]">
                  <span>Paste Worksheet Problems</span>
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="hover:text-white transition-colors flex items-center gap-1 font-mono tracking-normal"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                </div>

                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Paste your questions or problems here...&#10;&#10;1. 5x - 15 = 35&#10;2. What is the capital of New Zealand?&#10;3. State the primary function of the mitochondria."
                  rows={5}
                  autoFocus
                  className="w-full bg-transparent border-0 outline-none font-mono text-xs md:text-sm text-white placeholder:text-[#454340] leading-relaxed resize-none h-[110px] md:h-[130px]"
                />

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <span className="text-[10px] text-[#5c5a56] font-mono">
                    {textPrompt.trim()
                      ? `${textPrompt.split('\n').filter((l) => l.trim()).length} questions entered`
                      : 'Verified solutions in 1-2 seconds'}
                  </span>

                  <button
                    type="submit"
                    disabled={isSolving || !textPrompt.trim()}
                    className="px-6 py-2.5 rounded-xl font-semibold text-xs tracking-[0.2em] uppercase text-black active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span>Complete</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* ANSWERED WORKSHEET STAGE */
          <CompletedWorksheetBox
            data={currentSession.data}
            rawText={currentSession.rawText}
            profile={profile}
            onBack={() => setCurrentSession(null)}
            onToast={showToast}
          />
        )}
      </main>

      {/* FIXED FOOTER */}
      <footer className="relative z-10 w-full h-[38px] shrink-0 px-6 flex items-center justify-between text-[9.5px] tracking-[0.2em] uppercase text-[#5c5a56] border-t border-white/[0.04] no-print">
        <div className="flex items-center gap-2">
          <span>Harlan Presents</span>
          <span>·</span>
          <span>Do My Work</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[#8a8780]">S</kbd> for settings</span>
          <span>·</span>
          <span>Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[#8a8780]">C</kbd> to copy</span>
        </div>
      </footer>

      {/* VIP Modal (Silent & smooth) */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSuccess={handleVipUnlocked}
        isAlreadyVip={profile.isVip}
        accentColor={accentColor}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(newProfile) => {
          updateProfile(newProfile);
          setIsOnboardingOpen(false);
          showToast(`Welcome, ${newProfile.name || 'Scholar'}!`);
        }}
        initialProfile={profile}
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
        dailyUsageCount={dailyCount}
        onOpenVipModal={() => setIsVipModalOpen(true)}
        history={history}
        onSelectHistorySession={(session) => {
          setCurrentSession(session);
        }}
        onClearHistory={() => {
          setHistory([]);
          try {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
          } catch (e) {}
          showToast('History cleared');
        }}
        onToast={showToast}
        onToggleFocus={() => setIsFocusMode(!isFocusMode)}
        isFocusMode={isFocusMode}
        onReplayTrailer={() => setShowTrailer(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9900] px-4 py-2 rounded-full bg-[#131317] border border-white/15 text-white text-xs font-semibold tracking-wider shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
