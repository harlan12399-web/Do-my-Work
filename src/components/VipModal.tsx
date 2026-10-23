import React, { useState, useEffect, useRef } from 'react';
import { VIP_CODE } from '../types.ts';
import { Check, X, ShieldCheck, ArrowRight, Lock, Unlock, Sparkles, KeyRound } from 'lucide-react';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAlreadyVip?: boolean;
  accentColor?: string;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isAlreadyVip = false,
  accentColor = '#ff7a3d',
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(false);
      setIsVerifying(false);
      setIsUnlocked(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerUnlock = () => {
    setIsVerifying(true);
    setError(false);

    // Phase 1: Lock to unlock morph (600ms)
    setTimeout(() => {
      setIsUnlocked(true);
    }, 600);

    // Phase 2: Complete and close (1750ms)
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1750);
  };

  const handleDigitChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setCode(cleaned);
    if (error) setError(false);

    // Auto submit once 4 digits entered if matching VIP code
    if (cleaned === VIP_CODE) {
      triggerUnlock();
    } else if (cleaned.length === 4) {
      // Wrong 4-digit code entered
      setTimeout(() => {
        setError(true);
      }, 150);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.trim() === VIP_CODE) {
      triggerUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm p-7 md:p-8 rounded-2xl bg-[#0d0d10] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Silent ethereal expanding rings on unlock */}
        {isVerifying && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
            <div
              className="absolute w-44 h-44 rounded-full border border-white/20 animate-ping opacity-60"
              style={{ animationDuration: '1.4s' }}
            />
            <div
              className="absolute w-72 h-72 rounded-full border border-white/10 animate-ping opacity-30"
              style={{ animationDuration: '2.2s', animationDelay: '0.2s' }}
            />
            <div
              className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-1000"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-[#8a8780] hover:text-white transition-colors z-20"
          aria-label="Close dialog"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Modal Body */}
        <div className="text-center relative z-10">
          
          {/* Animated Lock Emblem with silky morph */}
          <div className="relative w-14 h-14 mx-auto mb-3.5 flex items-center justify-center">
            {/* Background halo */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 blur-sm ${
                isUnlocked ? 'scale-125 opacity-40' : 'opacity-0 scale-90'
              }`}
              style={{ backgroundColor: accentColor }}
            />

            <div
              className={`relative w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-700 ${
                isUnlocked
                  ? 'border-white/40 bg-white/10 scale-110 shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                  : isVerifying
                  ? 'border-white/30 bg-white/5 animate-pulse'
                  : 'border-white/15 bg-white/[0.02]'
              }`}
            >
              {isUnlocked ? (
                <Unlock
                  className="w-6 h-6 text-white animate-in zoom-in-75 duration-300"
                  style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }}
                />
              ) : isVerifying ? (
                <KeyRound className="w-5 h-5 text-white/90 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Lock className="w-5 h-5 text-[#8a8780]" />
              )}
            </div>
          </div>

          <div
            className="text-[9px] tracking-[0.45em] uppercase font-medium mb-1.5 transition-colors duration-500"
            style={{ color: isUnlocked ? '#34d399' : accentColor }}
          >
            {isUnlocked ? 'Clearance Granted' : 'VIP Clearance Key'}
          </div>

          <h2 className="font-serif-italic text-2xl md:text-3xl text-white mb-1.5 transition-all duration-300">
            {isUnlocked ? 'Welcome, VIP' : 'Enter VIP Key'}
          </h2>

          <p className="text-xs text-[#8a8780] max-w-xs mx-auto leading-relaxed mb-5 font-light">
            {isUnlocked
              ? 'Priority academic solve quota removed. Unlimited solves enabled.'
              : 'Enter your 4-digit VIP access code for unlimited daily worksheet completions.'}
          </p>

          {isAlreadyVip ? (
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-center mb-5">
              <div className="inline-flex items-center gap-1.5 text-xs text-white font-medium">
                <ShieldCheck className="w-4 h-4" style={{ color: accentColor }} />
                <span>Your VIP Access is currently active</span>
              </div>
              <p className="text-[10px] text-[#8a8780] mt-1">Unlimited worksheet solves enabled without quota restrictions.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Luxury 4-Digit Box Display */}
              <div
                className={`relative flex justify-center gap-2.5 my-3 ${
                  error ? 'animate-shake' : ''
                }`}
              >
                {[0, 1, 2, 3].map((idx) => {
                  const digit = code[idx] || '';
                  const isCurrent = code.length === idx;
                  const isEntered = Boolean(digit);

                  return (
                    <div
                      key={idx}
                      className={`relative w-12 h-14 rounded-xl border flex items-center justify-center font-mono text-xl transition-all duration-200 ${
                        isUnlocked
                          ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)] scale-105'
                          : error
                          ? 'border-red-500/60 bg-red-500/10 text-red-300'
                          : isEntered
                          ? 'border-white/50 bg-white/[0.06] text-white shadow-sm scale-[1.02]'
                          : isCurrent
                          ? 'border-white/35 bg-white/[0.03]'
                          : 'border-white/10 bg-white/[0.01] text-transparent'
                      }`}
                    >
                      {/* Active cursor tick mark */}
                      {isCurrent && !isVerifying && !isUnlocked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-ping absolute" />
                      )}

                      {/* Dot symbol with spring appearance */}
                      <span className="transition-transform duration-150 transform scale-100">
                        {digit ? '•' : ''}
                      </span>
                    </div>
                  );
                })}

                {/* Hidden native input for keyboard capture */}
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={code}
                  onChange={(e) => handleDigitChange(e.target.value)}
                  maxLength={4}
                  disabled={isVerifying || isUnlocked}
                  className="absolute inset-0 opacity-0 cursor-text w-full h-full"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 font-light animate-in fade-in slide-in-from-top-1">
                  Incorrect key. Please check and try again.
                </p>
              )}

              {isUnlocked && (
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-bottom-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>VIP Solves Permanently Activated</span>
                </div>
              )}

              <button
                type="submit"
                disabled={code.length < 4 || isVerifying || isUnlocked}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-[0.25em] uppercase text-black bg-[#e8e6e1] hover:bg-white active:scale-[0.99] disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isUnlocked ? '#34d399' : undefined,
                }}
              >
                {isUnlocked ? (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : isVerifying ? (
                  <span>Verifying clearance...</span>
                ) : (
                  <>
                    <span>Unlock VIP Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3.5 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-[#8a8780] hover:text-white transition-colors font-light"
            >
              Continue with Standard Mode (15/Day)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
