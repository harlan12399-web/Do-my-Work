import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { ArrowRight, ArrowLeft, Sun, Moon, Sparkles, Check, Heart, Shield } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
  initialProfile?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialProfile,
}) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 16);
  const [yearGroup, setYearGroup] = useState(initialProfile?.yearGroup || 'Year 11');
  const [gender, setGender] = useState<'boy' | 'girl'>(initialProfile?.gender || 'boy');
  const [celestial, setCelestial] = useState<'auto' | 'sun' | 'flower' | 'moon'>(
    initialProfile?.celestial || 'auto'
  );

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name.trim() || 'Scholar',
        age,
        gender,
        yearGroup,
        celestial,
        onboardingCompleted: true,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const bumpAge = (delta: number) => {
    setAge((prev) => Math.max(5, Math.min(100, prev + delta)));
  };

  // Preview theme color based on selected gender
  const currentAccent = gender === 'girl' ? '#ff6b9d' : '#ff7a3d';

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-7 md:p-8 rounded-2xl bg-[#0d0d10] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Glow halo that changes color with gender */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 blur-3xl pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: `${currentAccent}20` }}
        />

        {/* Progress bars */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-[2px] rounded-full transition-all duration-500 ${
                i === step
                  ? 'bg-white shadow-[0_0_8px_white]'
                  : i < step
                  ? 'bg-white/40'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div className="text-[9px] tracking-[0.4em] uppercase text-[#8a8780] font-semibold mb-2">
          0{step + 1} / 0{totalSteps}
        </div>

        {/* STEP 1: Name */}
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: currentAccent }}
            >
              Step 1 · Identity
            </div>
            <h2 className="font-serif-italic text-2xl md:text-3xl text-white">
              What should we call you?
            </h2>
            <p className="text-xs text-[#8a8780] leading-relaxed">
              We personalize your worksheet header and fill in your name automatically on every completed assignment.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) handleNext();
              }}
              className="pt-2"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                autoFocus
                maxLength={24}
                className="w-full py-3.5 px-4 text-center text-lg text-white bg-white/[0.03] border border-white/15 focus:border-white/40 rounded-xl outline-none transition-all placeholder:text-[#5c5a56]"
              />
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Age (with - and + picker like reference site) */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: currentAccent }}
            >
              Step 2 · Age
            </div>
            <h2 className="font-serif-italic text-2xl md:text-3xl text-white">
              How old are you?
            </h2>
            <p className="text-xs text-[#8a8780] leading-relaxed">
              Adjust your age for age-appropriate solution depths and phrasing.
            </p>

            {/* Compact Age Picker */}
            <div className="flex items-center justify-center gap-6 py-6">
              <button
                type="button"
                onClick={() => bumpAge(-1)}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center text-xl text-white font-medium transition-all active:scale-95"
                aria-label="Decrease age"
              >
                −
              </button>

              <div className="flex flex-col items-center">
                <span className="font-serif-italic text-5xl md:text-6xl text-white font-normal min-w-[3ch] text-center font-mono-tabular">
                  {age}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8a8780] mt-1">
                  Years Old
                </span>
              </div>

              <button
                type="button"
                onClick={() => bumpAge(1)}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center text-xl text-white font-medium transition-all active:scale-95"
                aria-label="Increase age"
              >
                +
              </button>
            </div>

            <div className="mt-6 flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-xl border border-white/10 text-xs text-[#8a8780] hover:text-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Gender / Theme (Girl = Pink, Boy = Orange) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: currentAccent }}
            >
              Step 3 · Theme
            </div>
            <h2 className="font-serif-italic text-2xl md:text-3xl text-white">
              Pick your theme
            </h2>
            <p className="text-xs text-[#8a8780] leading-relaxed">
              Selecting <strong className="text-pink-300">Girl</strong> sets a vibrant rose pink theme across the app; selecting <strong className="text-orange-300">Boy</strong> sets the warm amber orange aesthetic.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-3">
              {/* Girl Card */}
              <button
                type="button"
                onClick={() => setGender('girl')}
                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                  gender === 'girl'
                    ? 'border-[#ff6b9d] bg-[#ff6b9d]/15 text-white shadow-[0_0_25px_rgba(255,107,157,0.3)]'
                    : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full border border-[#ff6b9d]/40 bg-[#ff6b9d]/20 flex items-center justify-center text-[#ff6b9d]">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">Girl</div>
                  <div className="text-[10px] text-[#e88bab] mt-0.5 font-medium">Rose Pink Theme</div>
                </div>
              </button>

              {/* Boy Card */}
              <button
                type="button"
                onClick={() => setGender('boy')}
                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                  gender === 'boy'
                    ? 'border-[#ff7a3d] bg-[#ff7a3d]/15 text-white shadow-[0_0_25px_rgba(255,122,61,0.3)]'
                    : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full border border-[#ff7a3d]/40 bg-[#ff7a3d]/20 flex items-center justify-center text-[#ff7a3d]">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">Boy</div>
                  <div className="text-[10px] text-[#ff7a3d] mt-0.5 font-medium">Warm Amber Theme</div>
                </div>
              </button>
            </div>

            <div className="mt-6 flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-xl border border-white/10 text-xs text-[#8a8780] hover:text-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Year / Grade */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: currentAccent }}
            >
              Step 4 · Year Group
            </div>
            <h2 className="font-serif-italic text-2xl md:text-3xl text-white">
              What year are you in?
            </h2>
            <p className="text-xs text-[#8a8780] leading-relaxed">
              Stamped automatically on your completed worksheets for class submission.
            </p>
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {['Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', 'College'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setYearGroup(lvl)}
                  className={`py-3 px-2 rounded-xl text-xs font-medium border transition-all ${
                    yearGroup === lvl
                      ? 'border-white/50 bg-white/10 text-white font-bold'
                      : 'border-white/10 bg-white/[0.02] text-[#8a8780] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-xl border border-white/10 text-xs text-[#8a8780] hover:text-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Final Confirmation */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: currentAccent }}
            >
              All Set
            </div>
            <h2 className="font-serif-italic text-2xl md:text-3xl text-white">
              Ready when you are.
            </h2>
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[#8a8780]">
                <span>Student</span>
                <span className="text-white font-medium">{name || 'Scholar'}</span>
              </div>
              <div className="flex justify-between items-center text-[#8a8780]">
                <span>Age</span>
                <span className="text-white font-medium">{age} years</span>
              </div>
              <div className="flex justify-between items-center text-[#8a8780]">
                <span>Theme & Gender</span>
                <span
                  className="font-medium capitalize"
                  style={{ color: currentAccent }}
                >
                  {gender === 'girl' ? 'Girl (Rose Pink)' : 'Boy (Warm Amber)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#8a8780]">
                <span>Year Group</span>
                <span className="text-white font-medium">{yearGroup}</span>
              </div>
              <div className="flex justify-between items-center text-[#8a8780] pt-1.5 border-t border-white/5">
                <span>Auto-fill on Worksheet</span>
                <span className="text-emerald-400 font-medium">Enabled (Name & Date)</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-xl border border-white/10 text-xs text-[#8a8780] hover:text-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Start Solving</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
