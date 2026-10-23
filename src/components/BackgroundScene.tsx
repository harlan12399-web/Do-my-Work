import React, { useMemo } from 'react';

interface BackgroundSceneProps {
  celestialMode?: 'auto' | 'sun' | 'flower' | 'moon';
  theme?: 'amber' | 'rose' | 'azure';
}

export const BackgroundScene: React.FC<BackgroundSceneProps> = ({
  celestialMode = 'auto',
  theme = 'amber',
}) => {
  const effectiveCelestial = useMemo(() => {
    if (celestialMode !== 'auto') return celestialMode;
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6 ? 'moon' : 'sun';
  }, [celestialMode]);

  const dustParticles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: (i * 6.2 + 3) % 100,
      dur: 35 + (i * 2.3) % 20,
      delay: -(i * 3.7) % 30,
      dx: ((i % 5) - 2) * 15,
    }));
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: (i * 13.7) % 96 + 2,
      y: (i * 11.3) % 65 + 4,
      size: (i % 3) * 0.5 + 1,
      dur: 4 + (i % 4),
      delay: -(i * 1.1),
    }));
  }, []);

  const themeColors = {
    amber: {
      accent: '#c9bfa8',
      glow: 'rgba(255,122,61,0.05)',
      line: 'rgba(255,154,92,0.35)',
    },
    rose: {
      accent: '#e88bab',
      glow: 'rgba(255,107,157,0.05)',
      line: 'rgba(255,107,157,0.35)',
    },
    azure: {
      accent: '#93c5fd',
      glow: 'rgba(56,189,248,0.05)',
      line: 'rgba(56,189,248,0.35)',
    },
  }[theme];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Radial vignette glow */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(ellipse 65% 45% at 80% 15%, ${themeColors.glow} 0%, transparent 68%),
            radial-gradient(ellipse 85% 60% at 50% 115%, rgba(0,0,0,0.65) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Grain Texture */}
      <div className="grain-overlay" />

      {/* Ambient Rising Dust */}
      <div className="absolute inset-0 overflow-hidden">
        {dustParticles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-[-10px] w-[1.5px] h-[1.5px] rounded-full"
            style={{
              left: `${p.x}%`,
              backgroundColor: themeColors.accent,
              opacity: 0.16,
              animation: `dustFloat ${p.dur}s linear infinite`,
              animationDelay: `${p.delay}s`,
              transform: `translateX(${p.dx}px)`,
            }}
          />
        ))}
      </div>

      {/* Constellation Night Stars */}
      {effectiveCelestial === 'moon' && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-80">
          {stars.map((s) => (
            <span
              key={s.id}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: themeColors.accent,
                opacity: 0.35,
                animation: `twinkle ${s.dur}s ease-in-out infinite`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Passing Airplane with Contrail */}
      <div
        className="absolute top-[8%] left-0 w-[min(340px,34vw)] opacity-35 will-change-transform"
        style={{
          animation: 'planeGlide 90s linear infinite',
          animationDelay: '-22s',
          color: themeColors.accent,
        }}
      >
        <svg viewBox="0 0 600 40" preserveAspectRatio="xMidYMid meet" className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="planeContrail" x1="0" y1="20" x2="540" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="540" y2="20" stroke="url(#planeContrail)" strokeWidth="1.8" strokeLinecap="round" />
          <g transform="translate(565,20)">
            <path
              d="M 0 0 L -12 -1.6 L -20 -9 L -23 -9 L -17 -1.6 L -30 -1.6 L -32 0 L -30 1.6 L -17 1.6 L -23 9 L -20 9 L -12 1.6 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </div>

      {/* CELESTIAL ELEMENT (Positioned HIGH UP in the sky so it's NEVER behind the central card!) */}
      <div
        className="absolute top-3 right-3 sm:top-5 sm:right-6 md:top-6 md:right-10 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 transition-all duration-1000 z-0 pointer-events-none"
        style={{ color: themeColors.accent }}
      >
        {effectiveCelestial === 'sun' && (
          <svg viewBox="-140 -140 280 280" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id="sunHaloG">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
                <stop offset="35%" stopColor="currentColor" stopOpacity="0.14" />
                <stop offset="70%" stopColor="currentColor" stopOpacity="0.04" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sunGlowIn">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="45%" stopColor="currentColor" stopOpacity="0.12" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Concentric Soft Halos */}
            <circle cx="0" cy="0" r="130" fill="url(#sunHaloG)" className="animate-glow-pulse" />
            <circle cx="0" cy="0" r="75" fill="url(#sunGlowIn)" />

            {/* Core Solid Discs */}
            <circle cx="0" cy="0" r="22" fill="currentColor" fillOpacity="0.06" stroke="none" />
            <circle cx="0" cy="0" r="32" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="3 3" />
            
            {/* Main Sun Rim Circle - rays attach directly to this rim at r=44 */}
            <circle
              cx="0"
              cy="0"
              r="44"
              fill="currentColor"
              fillOpacity="0.04"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeOpacity="0.65"
            />

            {/* Rotating Sun Rays (GPU accelerated CSS keyframe centered at 0 0 - ZERO glitches) */}
            <g className="celestial-spin-group">
              {/* Major Rays (16 rays): Start exactly on rim (r=44) and extend to r=74 */}
              {[
                0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5,
                180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5
              ].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const x1 = +(cos * 44).toFixed(2);
                const y1 = +(sin * 44).toFixed(2);
                const x2 = +(cos * 74).toFixed(2);
                const y2 = +(sin * 74).toFixed(2);
                const dotX = +(cos * 80).toFixed(2);
                const dotY = +(sin * 80).toFixed(2);
                return (
                  <g key={`maj-${deg}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth="0.85"
                      strokeOpacity="0.6"
                      strokeLinecap="round"
                    />
                    {/* Concentric terminal tick dot */}
                    <circle
                      cx={dotX}
                      cy={dotY}
                      r="0.9"
                      fill="currentColor"
                      fillOpacity="0.4"
                    />
                  </g>
                );
              })}

              {/* Minor Rays (16 intermediate rays): Start exactly on rim (r=44) and extend to r=58 */}
              {[
                11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75,
                191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75
              ].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const x1 = +(cos * 44).toFixed(2);
                const y1 = +(sin * 44).toFixed(2);
                const x2 = +(cos * 58).toFixed(2);
                const y2 = +(sin * 58).toFixed(2);
                return (
                  <line
                    key={`min-${deg}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="0.6"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Concentric outer orbit hairline */}
              <circle
                cx="0"
                cy="0"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeOpacity="0.18"
                strokeDasharray="2 6"
              />
            </g>
          </svg>
        )}

        {effectiveCelestial === 'moon' && (
          <svg viewBox="-140 -140 280 280" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id="moonAura">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.03" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r="110" fill="url(#moonAura)" />
            <circle cx="0" cy="0" r="40" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.6" />
            <g opacity="0.45">
              <circle cx="-13" cy="-9" r="5.5" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="7" cy="-16" r="2.6" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="16" cy="4" r="4.2" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="-7" cy="15" r="3.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
            </g>
          </svg>
        )}

        {effectiveCelestial === 'flower' && (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
              <circle cx="80" cy="80" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
              <circle cx="80" cy="80" r="4" fill="currentColor" stroke="none" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <path
                  key={deg}
                  d="M 80 80 C 72 65 72 40 80 30 C 88 40 88 65 80 80 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  opacity="0.75"
                  transform={`rotate(${deg} 80 80)`}
                />
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* FLYING SEAGULLS & ROLLING HILLS (Clean SVG glide) */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{ color: themeColors.accent }}
      >
        <g opacity="0.12">
          <path
            d="M-80 666 C 200 576, 380 736, 660 666 S 1060 566, 1320 666 S 1480 706, 1520 686"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M-80 790 C 240 708, 420 852, 720 780 S 1120 690, 1380 780 S 1500 808, 1520 800"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        {/* Flying Seagull 1 */}
        <g className="gull-fly-1">
          <g className="gull-bob">
            <path d="M -3 -1 C -8 -5 -13 -8 -19 -6" fill="none" stroke="currentColor" strokeWidth="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="16 0 0; -10 0 0; 16 0 0"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M 3 -1 C 8 -5 13 -8 19 -6" fill="none" stroke="currentColor" strokeWidth="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-16 0 0; 10 0 0; -16 0 0"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M -2 0 Q 0 2 2 0" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          </g>
        </g>

        {/* Flying Seagull 2 */}
        <g transform="scale(1.15)">
          <g className="gull-fly-2">
            <g className="gull-bob" style={{ animationDuration: '5.6s' }}>
              <path d="M -3 -1 C -8 -5 -13 -8 -19 -6" fill="none" stroke="currentColor" strokeWidth="1">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="18 0 0; -12 0 0; 18 0 0"
                  dur="1.9s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M 3 -1 C 8 -5 13 -8 19 -6" fill="none" stroke="currentColor" strokeWidth="1">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-18 0 0; 12 0 0; -18 0 0"
                  dur="1.9s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M -2 0 Q 0 2 2 0" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
            </g>
          </g>
        </g>

        {/* Flying Seagull 3 */}
        <g transform="scale(0.75)">
          <g className="gull-fly-3">
            <g className="gull-bob" style={{ animationDuration: '4s' }}>
              <path d="M -3 -1 C -8 -5 -13 -8 -19 -6" fill="none" stroke="currentColor" strokeWidth="1">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="14 0 0; -8 0 0; 14 0 0"
                  dur="1.3s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M 3 -1 C 8 -5 13 -8 19 -6" fill="none" stroke="currentColor" strokeWidth="1">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-14 0 0; 8 0 0; -14 0 0"
                  dur="1.3s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M -2 0 Q 0 2 2 0" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
            </g>
          </g>
        </g>
      </svg>

      <style>{`
        @keyframes planeGlide {
          from { transform: translate(-35vw, 4vh); }
          to { transform: translate(125vw, -6vh); }
        }
        @keyframes dustFloat {
          0% { opacity: 0; transform: translate(0, 0); }
          15% { opacity: 0.16; }
          85% { opacity: 0.16; }
          100% { opacity: 0; transform: translate(25px, -100vh); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.6; }
        }

        .gull-bob {
          animation: gullBob 5s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes gullBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .gull-fly-1 {
          animation: gullFly1 52s linear infinite;
          animation-delay: -8s;
        }
        @keyframes gullFly1 {
          0% { transform: translate(-220px, 220px); opacity: 0; }
          12% { opacity: 0.28; }
          85% { opacity: 0.28; }
          100% { transform: translate(1680px, 160px); opacity: 0; }
        }

        .gull-fly-2 {
          animation: gullFly2 64s linear infinite;
          animation-delay: -32s;
        }
        @keyframes gullFly2 {
          0% { transform: translate(-220px, 340px); opacity: 0; }
          12% { opacity: 0.20; }
          85% { opacity: 0.20; }
          100% { transform: translate(1680px, 270px); opacity: 0; }
        }

        .gull-fly-3 {
          animation: gullFly3 44s linear infinite;
          animation-delay: -20s;
        }
        @keyframes gullFly3 {
          0% { transform: translate(-220px, 148px); opacity: 0; }
          12% { opacity: 0.18; }
          85% { opacity: 0.18; }
          100% { transform: translate(1680px, 100px); opacity: 0; }
        }

        .celestial-spin-group {
          transform-origin: 0px 0px;
          animation: celestialSpin 180s linear infinite;
          will-change: transform;
        }
        @keyframes celestialSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
