import React from 'react';
import { FrogCharacter } from './FrogCharacter';

interface PondStageProps {
  totalQuestions: number;
  currentStepIndex: number; // 0 = start shore, 1..N = pad index, N+1 = victory shore
  isJumping: boolean;
  isSplashing: boolean;
  hasWon: boolean;
  streak: number;
  waterRipples: { id: number; right: number; bottom: number }[];
}

export const PondStage: React.FC<PondStageProps> = ({
  totalQuestions,
  currentStepIndex,
  isJumping,
  isSplashing,
  hasWon,
  streak,
  waterRipples
}) => {
  // Compute frog position based on currentStepIndex:
  // stepIndex = -1 or 0 -> Start shore (~5%)
  // stepIndex = 0..total-1 -> Lily pad i
  // stepIndex >= total -> Golden shore (~88%)
  const startShoreRight = 4;
  const finishShoreRight = 88;
  const padStartRight = 16;
  const padEndRight = 76;

  let frogRight = startShoreRight;
  if (hasWon || currentStepIndex >= totalQuestions) {
    frogRight = finishShoreRight;
  } else if (currentStepIndex > 0) {
    const padIdx = currentStepIndex - 1;
    const stepRatio = totalQuestions > 1 ? padIdx / (totalQuestions - 1) : 0.5;
    frogRight = padStartRight + stepRatio * (padEndRight - padStartRight);
  }

  return (
    <div
      id="pond-stage"
      className="w-full h-64 sm:h-72 pond-gradient rounded-3xl relative overflow-hidden border-4 border-amber-300/40 shadow-2xl mb-4 select-none"
    >
      {/* Background Water Surface Texture & Caustics */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#a5f3fc_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
      
      {/* Soft Wave Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-sky-400/25 to-transparent pointer-events-none" />

      {/* Floating Ambient Fireflies / Lights */}
      <div className="absolute top-6 right-28 w-2 h-2 rounded-full bg-amber-300 firefly-glow shadow-[0_0_12px_#fde047]" />
      <div className="absolute top-16 left-32 w-2.5 h-2.5 rounded-full bg-emerald-300 firefly-glow shadow-[0_0_12px_#86efac] [animation-delay:-1.8s]" />
      <div className="absolute bottom-16 left-1/2 w-2 h-2 rounded-full bg-amber-200 firefly-glow shadow-[0_0_10px_#fef08a] [animation-delay:-3.2s]" />

      {/* START SHORE (Right side in RTL) */}
      <div className="absolute right-0 bottom-0 w-24 sm:w-32 h-24 bg-gradient-to-tl from-emerald-900 via-emerald-800 to-emerald-700 rounded-tl-full border-t-4 border-l-2 border-emerald-400 flex flex-col items-center justify-end pb-3 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {/* Cattails & Plants Decor */}
        <div className="absolute -top-7 right-3 flex items-end gap-1 pointer-events-none">
          <div className="w-1.5 h-8 bg-emerald-600 rounded-full rotate-6"></div>
          <div className="w-2 h-11 bg-amber-800 rounded-full border border-amber-950 flex flex-col items-center">
            <div className="w-3 h-5 bg-amber-900 rounded-full -mt-0.5"></div>
          </div>
          <div className="w-1.5 h-9 bg-emerald-500 rounded-full -rotate-12"></div>
        </div>
        <span className="text-xs sm:text-sm text-emerald-200 font-extrabold flex items-center gap-1 drop-shadow">
          <span>🌿</span>
          <span>البداية</span>
        </span>
        <span className="text-[10px] text-emerald-300/80">انطلاق الضفدع</span>
      </div>

      {/* GOLDEN VICTORY SHORE (Left side in RTL) */}
      <div className="absolute left-0 bottom-0 w-28 sm:w-36 h-28 bg-gradient-to-tr from-emerald-900 via-teal-800 to-amber-700 rounded-tr-full border-t-4 border-r-2 border-amber-300 flex flex-col items-center justify-end pb-4 z-10 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
        {/* Golden Trophy & Festive Blooms */}
        <div className="absolute -top-6 left-5 flex items-center justify-center animate-bounce">
          <span className="text-3xl drop-shadow-[0_4px_10px_rgba(251,191,36,0.8)]">🏆</span>
        </div>
        <div className="absolute -top-2 right-4 text-xl animate-pulse">
          🌸
        </div>
        <span className="text-xs sm:text-sm text-amber-300 font-black drop-shadow flex items-center gap-1">
          <span>الضفة الذهبية</span>
          <span>✨</span>
        </span>
        <span className="text-[10px] text-amber-200/90 font-medium">خط النهاية</span>
      </div>

      {/* WATER RIPPLE EFFECTS (Spawn on jump landing or splash) */}
      {waterRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="water-ripple absolute pointer-events-none rounded-[50%] border-2 border-cyan-200/70 z-15"
          style={{
            right: `${ripple.right}%`,
            bottom: `${ripple.bottom}px`,
            width: '60px',
            height: '24px',
            transform: 'translate(50%, 50%)'
          }}
        />
      ))}

      {/* DYNAMIC LILY PADS TRACK */}
      <div className="w-full h-full relative z-20 pointer-events-none">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const stepRatio = totalQuestions > 1 ? i / (totalQuestions - 1) : 0.5;
          const padRightPercent = padStartRight + stepRatio * (padEndRight - padStartRight);
          
          const isPassed = currentStepIndex > i + 1;
          const isCurrentTarget = currentStepIndex === i + 1;
          const isNextInLine = currentStepIndex === i;

          return (
            <div
              key={i}
              className="floating-pad absolute bottom-7 flex flex-col items-center select-none"
              style={{
                right: `${padRightPercent}%`,
                transform: 'translateX(50%)',
                animationDelay: `${-(i * 0.65)}s`
              }}
            >
              {/* Lily Pad Base Leaf */}
              <div
                className={`relative w-16 sm:w-22 h-8 sm:h-10 rounded-[50%] transition-all duration-300 flex items-center justify-center ${
                  isPassed
                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-b-4 border-emerald-800 shadow-[0_8px_16px_rgba(0,0,0,0.35)]'
                    : isCurrentTarget
                    ? 'bg-gradient-to-b from-emerald-300 to-emerald-500 border-b-4 border-emerald-700 shadow-[0_0_20px_#34d399]'
                    : 'bg-gradient-to-b from-emerald-500/90 to-emerald-700 border-b-4 border-emerald-900 shadow-md'
                }`}
              >
                {/* Pad Natural Leaf Notch / Cutout SVG */}
                <svg
                  viewBox="0 0 100 45"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  {/* Veins */}
                  <path
                    d="M 50 22 Q 25 15 10 20 M 50 22 Q 35 32 18 36 M 50 22 Q 65 32 82 36 M 50 22 Q 75 15 90 20 M 50 22 L 50 8"
                    stroke="#052e16"
                    strokeWidth="1.2"
                    strokeOpacity="0.3"
                    fill="none"
                  />
                  {/* Water drop on leaf */}
                  <circle cx="68" cy="16" r="2" fill="#e0f2fe" opacity="0.75" />
                </svg>

                {/* Pink Lotus Flower / Bud on Completed Pad */}
                {isPassed && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm sm:text-base animate-pulse">
                    🌸
                  </div>
                )}

                {/* Glow ring if it's the current active pad */}
                {isNextInLine && (
                  <div className="absolute inset-0 rounded-[50%] border-2 border-amber-300 animate-ping opacity-60"></div>
                )}

                {/* Step number on pad */}
                <span
                  className={`text-[10px] sm:text-xs font-black z-10 ${
                    isPassed
                      ? 'text-emerald-950 font-bold opacity-75'
                      : isNextInLine
                      ? 'text-amber-200 drop-shadow'
                      : 'text-emerald-100'
                  }`}
                >
                  {i + 1}
                </span>
              </div>

              {/* Water Shadow under pad */}
              <div className="w-14 sm:w-18 h-3 bg-slate-950/40 rounded-[50%] blur-xs -mt-1 -z-10"></div>
            </div>
          );
        })}
      </div>

      {/* FROG CHARACTER */}
      <FrogCharacter
        positionRightPercent={frogRight}
        isJumping={isJumping}
        isSplashing={isSplashing}
        hasWon={hasWon}
        streak={streak}
      />
    </div>
  );
};
