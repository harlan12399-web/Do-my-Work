import React, { useState } from 'react';
import { UserProfile, WorksheetSession, DAILY_LIMIT } from '../types.ts';
import {
  X,
  User,
  Sparkles,
  KeyRound,
  History,
  Eye,
  Check,
  ShieldCheck,
  Trash2,
  Heart,
  Shield,
} from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  dailyUsageCount: number;
  onOpenVipModal: () => void;
  history: WorksheetSession[];
  onSelectHistorySession: (session: WorksheetSession) => void;
  onClearHistory: () => void;
  onToast: (msg: string) => void;
  onToggleFocus: () => void;
  isFocusMode: boolean;
  onReplayTrailer?: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  dailyUsageCount,
  onOpenVipModal,
  history,
  onSelectHistorySession,
  onClearHistory,
  onToast,
  onToggleFocus,
  isFocusMode,
  onReplayTrailer,
}) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState<number>(profile.age || 16);
  const [gender, setGender] = useState<'boy' | 'girl'>(profile.gender || 'boy');
  const [yearGroup, setYearGroup] = useState(profile.yearGroup || 'Year 11');
  const [celestial, setCelestial] = useState(profile.celestial);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({
      name: name.trim() || 'Scholar',
      age,
      gender,
      yearGroup,
      celestial,
    });
    onToast('Settings saved successfully');
    onClose();
  };

  const bumpAge = (delta: number) => {
    setAge((prev) => Math.max(5, Math.min(100, prev + delta)));
  };

  const remaining = Math.max(0, DAILY_LIMIT - dailyUsageCount);
  const accentColor = gender === 'girl' ? '#ff6b9d' : '#ff7a3d';

  return (
    <div className="fixed inset-0 z-[650] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#0d0d10] border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.9)] flex flex-col z-10 animate-drawer-in">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#131317]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-serif-italic text-lg text-white font-bold"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h3 className="font-serif-italic text-lg text-white leading-tight">
                {name || 'Scholar'}
              </h3>
              <p className="text-[11px] text-[#8a8780]">
                {profile.isVip ? 'VIP Scholar · Unlimited Access' : `${yearGroup} · Age ${age}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-[#8a8780] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* VIP Status Card */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-semibold flex items-center gap-1.5"
                style={{ color: accentColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tier & Daily Quota</span>
              </span>
              {profile.isVip ? (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                  }}
                >
                  VIP UNLOCKED
                </span>
              ) : (
                <span className="text-xs font-mono text-[#c9bfa8]">
                  {remaining} / {DAILY_LIMIT} left today
                </span>
              )}
            </div>

            {profile.isVip ? (
              <p className="text-xs text-[#8a8780]">
                Your account has full VIP access with unlimited solves, highest AI fidelity, and priority queues.
              </p>
            ) : (
              <div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden my-2">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(remaining / DAILY_LIMIT) * 100}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-[#8a8780]">Resets daily at midnight</span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVipModal();
                    }}
                    className="text-xs hover:underline font-semibold flex items-center gap-1"
                    style={{ color: accentColor }}
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Enter VIP Code (6856)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme & Gender Selection (Girl = Pink, Boy = Orange) */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#8a8780] font-semibold">
              Theme & Palette
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('girl')}
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  gender === 'girl'
                    ? 'border-[#ff6b9d] bg-[#ff6b9d]/15 text-white shadow-[0_0_15px_rgba(255,107,157,0.2)]'
                    : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4 text-[#ff6b9d] fill-current" />
                <div>
                  <div className="text-xs font-semibold text-white">Girl</div>
                  <div className="text-[10px] text-[#e88bab]">Rose Pink Theme</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGender('boy')}
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  gender === 'boy'
                    ? 'border-[#ff7a3d] bg-[#ff7a3d]/15 text-white shadow-[0_0_15px_rgba(255,122,61,0.2)]'
                    : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-[#ff7a3d]" />
                <div>
                  <div className="text-xs font-semibold text-white">Boy</div>
                  <div className="text-[10px] text-[#ff7a3d]">Warm Amber Theme</div>
                </div>
              </button>
            </div>
          </div>

          {/* Identity & Auto-fill Info */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#8a8780] font-semibold">
              Worksheet Auto-Fill Identity
            </h4>

            <div>
              <label className="block text-xs text-[#8a8780] mb-1.5">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                className="w-full py-2.5 px-3.5 text-xs text-white bg-white/[0.03] border border-white/10 focus:border-white/30 rounded-xl outline-none"
              />
            </div>

            {/* Age Picker */}
            <div>
              <label className="block text-xs text-[#8a8780] mb-1.5">Age</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => bumpAge(-1)}
                  className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white"
                >
                  −
                </button>
                <span className="font-serif-italic text-2xl text-white min-w-[3ch] text-center font-mono-tabular">
                  {age}
                </span>
                <button
                  type="button"
                  onClick={() => bumpAge(1)}
                  className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#8a8780] mb-1.5">Academic Level</label>
              <select
                value={yearGroup}
                onChange={(e) => setYearGroup(e.target.value)}
                className="w-full py-2.5 px-3.5 text-xs text-white bg-[#0d0d10] border border-white/10 focus:border-white/30 rounded-xl outline-none"
              >
                {['Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', 'College', 'Self-taught'].map(
                  (lvl) => (
                    <option key={lvl} value={lvl} className="bg-[#0d0d10]">
                      {lvl}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Atmosphere Settings */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#8a8780] font-semibold">
              Horizon
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'auto', name: 'Auto Sky' },
                { id: 'sun', name: 'Sun' },
                { id: 'moon', name: 'Moon' },
                { id: 'flower', name: 'Flower' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCelestial(c.id as any)}
                  className={`py-2 rounded-lg text-xs border capitalize transition-all ${
                    celestial === c.id
                      ? 'border-white/40 bg-white/10 text-white font-medium'
                      : 'border-white/10 text-[#8a8780] hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <button
              onClick={onToggleFocus}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                isFocusMode
                  ? 'border-white/40 bg-white/10 text-white'
                  : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>Focus Mode</span>
              </div>
              <span className="font-mono text-[10px] text-[#5c5a56]">Key: F</span>
            </button>

            {onReplayTrailer && (
              <button
                onClick={() => {
                  onClose();
                  onReplayTrailer();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] text-xs font-medium text-[#8a8780] hover:text-white flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff7a3d]" />
                  <span>Replay Harlan Currin Trailer & Intro</span>
                </div>
                <span className="text-[10px] text-[#5c5a56]">Watch</span>
              </button>
            )}
          </div>

          {/* Solved History */}
          {history.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#8a8780] font-semibold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Session History ({history.length})</span>
                </h4>
                <button
                  onClick={onClearHistory}
                  className="text-[10px] text-red-400/80 hover:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectHistorySession(item);
                      onClose();
                    }}
                    className="w-full p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] text-left transition-all group"
                  >
                    <div className="text-xs font-medium text-white group-hover:text-amber-300 line-clamp-1">
                      {item.data.title}
                    </div>
                    <div className="text-[10px] text-[#8a8780] mt-0.5">
                      {item.data.subject} · {item.data.items.length} answers
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-white/10 bg-[#131317]">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.2em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
