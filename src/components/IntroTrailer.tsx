import React, { useState, useEffect } from 'react';

interface IntroTrailerProps {
  onComplete: () => void;
  accentColor?: string;
}

export const IntroTrailer: React.FC<IntroTrailerProps> = ({
  onComplete,
  accentColor = '#ff7a3d',
}) => {
  const [activeScene, setActiveScene] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    // Exact cinematic choreography matching the reference trailer
    const sceneDelays = [
      { id: 0, hold: 2600 }, // Brought to you by
      { id: 1, hold: 3800 }, // Harlan Currin with burst
      { id: 2, hold: 2800 }, // Tired of doing worksheets by hand?
      { id: 3, hold: 2800 }, // Worksheets completed instantly
      { id: 4, hold: 2800 }, // Crafted with care
      { id: 5, hold: 3800 }, // Harlan Presents — Do My Work
    ];

    let current = 0;
    const timeouts: any[] = [];

    const scheduleNext = () => {
      if (current >= sceneDelays.length - 1) {
        timeouts.push(
          setTimeout(() => {
            setIsFading(true);
            timeouts.push(setTimeout(onComplete, 950));
          }, sceneDelays[current].hold)
        );
        return;
      }

      timeouts.push(
        setTimeout(() => {
          current++;
          setActiveScene(current);
          scheduleNext();
        }, sceneDelays[current].hold)
      );
    };

    scheduleNext();

    const handleSkip = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof MouseEvent ||
        (e instanceof KeyboardEvent && (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter'))
      ) {
        timeouts.forEach(clearTimeout);
        setIsFading(true);
        setTimeout(onComplete, 600);
      }
    };

    window.addEventListener('click', handleSkip);
    window.addEventListener('keydown', handleSkip);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#07070a] text-[#e8e6e1] flex items-center justify-center overflow-hidden cursor-pointer select-none transition-opacity duration-1000 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${accentColor}18, transparent 70%)`,
        }}
      />

      {/* Subtle moving streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse"
            style={{
              top: `${(i * 9 + 4) % 96}%`,
              left: `${(i * 14 + 2) % 85}%`,
              width: `${60 + (i * 25)}px`,
              animationDuration: `${4 + (i % 5)}s`,
              animationDelay: `${-(i * 0.7)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* SCENE 0: Brought to you by */}
        {activeScene === 0 && (
          <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-1000">
            {['Brought', 'to', 'you', 'by'].map((word, i) => (
              <span
                key={i}
                className="text-xs md:text-sm uppercase tracking-[0.55em] text-[#8a8780] font-medium"
                style={{
                  animation: `twordIn 1.1s cubic-bezier(.22, 1, .36, 1) forwards ${i * 0.14}s`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        )}

        {/* SCENE 1: Harlan Currin with burst */}
        {activeScene === 1 && (
          <div className="relative text-center animate-in fade-in duration-700">
            {/* Burst element */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full pointer-events-none blur-md animate-burst-out"
              style={{
                background: `radial-gradient(circle, ${accentColor}80, transparent 65%)`,
              }}
            />

            <div className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#8a8780] font-medium mb-3">
              Crafted & Engineered by
            </div>

            <div className="font-serif-italic text-6xl md:text-9xl text-white tracking-tight leading-none">
              {'Harlan Currin'.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    animation: `letterIn 1.4s cubic-bezier(.22, 1, .36, 1) forwards ${i * 0.08}s`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>

            <div
              className="w-16 h-[1px] mx-auto mt-6"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        )}

        {/* SCENE 2: Tired of doing worksheets by hand? (Slide animation) */}
        {activeScene === 2 && (
          <div className="text-center px-6 max-w-2xl">
            <div className="overflow-hidden mb-2">
              <span className="inline-block font-serif-italic text-3xl md:text-5xl text-white animate-slide-left">
                Tired of doing worksheets
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                className="inline-block font-serif-italic text-3xl md:text-5xl animate-slide-right"
                style={{ color: accentColor }}
              >
                by hand?
              </span>
            </div>
          </div>
        )}

        {/* SCENE 3: Worksheets completed instantly (Scale animation) */}
        {activeScene === 3 && (
          <div className="text-center px-6 max-w-2xl">
            <div className="flex flex-wrap justify-center gap-3">
              {['Worksheets', 'completed', 'in', 'seconds.'].map((word, i) => (
                <span
                  key={i}
                  className="inline-block font-serif-italic text-3xl md:text-5xl text-white"
                  style={{
                    animation: `scaleWordIn 1.2s cubic-bezier(.22, 1, .36, 1) forwards ${i * 0.16}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 4: Crafted with care (Split rotation) */}
        {activeScene === 4 && (
          <div className="text-center px-6 flex items-baseline justify-center gap-3 flex-wrap">
            <span className="font-serif-italic text-3xl md:text-5xl text-[#8a8780] animate-split-left">
              Crafted
            </span>
            <span
              className="font-serif-italic text-3xl md:text-5xl animate-split-right"
              style={{ color: accentColor }}
            >
              with care.
            </span>
          </div>
        )}

        {/* SCENE 5: Harlan Presents — Do My Work */}
        {activeScene === 5 && (
          <div className="text-center px-6 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-[10px] md:text-xs tracking-[0.55em] uppercase text-[#8a8780] font-medium mb-3">
              An Original Creation
            </div>

            <div className="presenting-text font-serif-italic text-5xl md:text-8xl text-white leading-none mb-3">
              Harlan Presents
            </div>

            <div className="font-serif-italic text-sm md:text-base text-[#8a8780] italic mb-6 font-light">
              Pure Academic Precision · Flawless Homework Solutions
            </div>

            <div
              className="inline-block px-7 py-2.5 rounded-full text-black font-semibold text-xs tracking-[0.28em] uppercase shadow-2xl transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              Do My Work
            </div>
          </div>
        )}
      </div>

      {/* Skip Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.45em] uppercase text-[#5c5a56] font-mono">
        Click anywhere to skip
      </div>

      <style>{`
        @keyframes twordIn {
          from { opacity: 0; filter: blur(14px); transform: translateY(22px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes letterIn {
          from { opacity: 0; filter: blur(24px); transform: translate(30px, 30px) rotate(8deg) scale(0.7); }
          to { opacity: 1; filter: blur(0); transform: none; }
        }
        @keyframes burstOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          30% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(180); }
        }
        .animate-burst-out {
          animation: burstOut 2s cubic-bezier(.22, 1, .36, 1) 0.8s forwards;
        }

        .animate-slide-left {
          animation: slideLeftIn 1.2s cubic-bezier(.22, 1, .36, 1) forwards;
        }
        @keyframes slideLeftIn {
          from { opacity: 0; filter: blur(12px); transform: translateX(-80px); }
          to { opacity: 1; filter: blur(0); transform: translateX(0); }
        }

        .animate-slide-right {
          animation: slideRightIn 1.2s cubic-bezier(.22, 1, .36, 1) 0.18s forwards;
        }
        @keyframes slideRightIn {
          from { opacity: 0; filter: blur(12px); transform: translateX(80px); }
          to { opacity: 1; filter: blur(0); transform: translateX(0); }
        }

        @keyframes scaleWordIn {
          from { opacity: 0; filter: blur(18px); transform: scale(1.35); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }

        .animate-split-left {
          animation: splitLeft 1.2s cubic-bezier(.22, 1, .36, 1) forwards;
        }
        @keyframes splitLeft {
          from { opacity: 0; filter: blur(16px); transform: translateX(-90px) rotate(-4deg); }
          to { opacity: 1; filter: blur(0); transform: none; }
        }

        .animate-split-right {
          animation: splitRight 1.2s cubic-bezier(.22, 1, .36, 1) 0.15s forwards;
        }
        @keyframes splitRight {
          from { opacity: 0; filter: blur(16px); transform: translateX(90px) rotate(4deg); }
          to { opacity: 1; filter: blur(0); transform: none; }
        }

        .presenting-text {
          letter-spacing: 0.08em;
          animation: presentingContract 1.5s cubic-bezier(.22, 1, .36, 1) forwards;
        }
        @keyframes presentingContract {
          from { opacity: 0; filter: blur(24px); transform: scale(1.25); letter-spacing: 0.6em; }
          to { opacity: 1; filter: blur(0); transform: scale(1); letter-spacing: 0.08em; }
        }
      `}</style>
    </div>
  );
};
