import React from 'react';

interface LineArtSolvingOverlayProps {
  solvingPhase: string;
  accentColor?: string;
}

export const LineArtSolvingOverlay: React.FC<LineArtSolvingOverlayProps> = ({
  solvingPhase,
  accentColor = '#ff7a3d',
}) => {
  return (
    <div className="fixed inset-0 z-[750] bg-[#07070a]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
      {/* Background radial glow matching site */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${accentColor}10, transparent 65%)`,
        }}
      />

      {/* Line Art Geometry (Matching Celestial & Hills Style) */}
      <div className="relative w-36 h-36 mb-6 flex items-center justify-center" style={{ color: accentColor }}>
        {/* Outer dashed spinning aura */}
        <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible animate-spin-slow">
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="3 7"
            strokeLinecap="round"
            opacity="0.4"
          />
          <circle
            cx="80"
            cy="80"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.25"
          />
          {/* Subtle celestial crosshairs */}
          <line x1="80" y1="6" x2="80" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="80" y1="140" x2="80" y2="154" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="6" y1="80" x2="20" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="140" y1="80" x2="154" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Counter-rotating inner compass */}
        <svg viewBox="0 0 100 100" className="absolute w-20 h-20 overflow-visible animate-spin-reverse">
          <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" />
          <polygon
            points="50,20 54,48 50,54 46,48"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <polygon
            points="50,80 54,52 50,46 46,52"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </svg>

        {/* Center breathing pulse dot */}
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
        />
      </div>

      {/* Refined Academic Status Labels */}
      <div className="text-[10px] tracking-[0.45em] uppercase text-[#8a8780] font-medium mb-2">
        Academic Solver
      </div>

      <h2 className="font-serif-italic text-2xl md:text-3xl text-white mb-3 tracking-wide">
        Completing Your Worksheet
      </h2>

      <p className="text-xs text-[#8a8780] font-light max-w-sm mx-auto min-h-[22px] transition-all">
        {solvingPhase || 'Computing answers and stamping student credentials...'}
      </p>

      {/* Delicate hairline progress rule */}
      <div className="w-36 h-[1px] bg-white/10 mt-6 relative overflow-hidden rounded-full">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-pass"
        />
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spinSlow 30s linear infinite;
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        .animate-spin-reverse {
          animation: spinReverse 18s linear infinite;
        }
        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }
        .animate-shimmer-pass {
          animation: shimmerPass 2s ease-in-out infinite;
        }
        @keyframes shimmerPass {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
