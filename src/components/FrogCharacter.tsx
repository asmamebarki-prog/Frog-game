import React from 'react';

interface FrogCharacterProps {
  positionRightPercent: number; // percentage from right shore
  isJumping: boolean;
  isSplashing: boolean;
  hasWon: boolean;
  streak: number;
}

export const FrogCharacter: React.FC<FrogCharacterProps> = ({
  positionRightPercent,
  isJumping,
  isSplashing,
  hasWon,
  streak
}) => {
  return (
    <div
      id="frog-character"
      className={`absolute bottom-7 z-30 transition-all duration-700 pointer-events-none select-none ${
        isSplashing ? 'frog-splash' : isJumping ? 'scale-110 -translate-y-8' : 'frog-idle'
      }`}
      style={{
        right: `${positionRightPercent}%`,
        transform: isSplashing
          ? undefined
          : isJumping
          ? `translate(50%, -36px) scale(1.15) rotate(-6deg)`
          : `translate(50%, 0) scale(1)`,
        transitionTimingFunction: 'cubic-bezier(0.34, 1.4, 0.64, 1)'
      }}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        
        {/* Golden Victory Crown 👑 */}
        {hasWon && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce z-40 text-2xl drop-shadow-md">
            👑
          </div>
        )}

        {/* Streak Flame Badge */}
        {streak >= 3 && !hasWon && !isSplashing && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-lg border border-yellow-200 animate-pulse flex items-center gap-0.5 whitespace-nowrap z-40">
            <span>🔥</span>
            <span>{streak}x</span>
          </div>
        )}

        {/* Snorkel / Splash Effect if splashed */}
        {isSplashing && (
          <div className="absolute -top-3 text-2xl animate-spin">
            💦
          </div>
        )}

        {/* SVG Frog Character */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_8px_12px_rgba(0,0,0,0.4)]"
        >
          {/* Back feet / Webbed flippers */}
          <ellipse
            cx="22"
            cy="76"
            rx="14"
            ry="7"
            fill="#15803d"
            transform={isJumping ? "rotate(-40 22 76)" : "rotate(-15 22 76)"}
          />
          <ellipse
            cx="78"
            cy="76"
            rx="14"
            ry="7"
            fill="#15803d"
            transform={isJumping ? "rotate(40 78 76)" : "rotate(15 78 76)"}
          />
          
          {/* Webbed toes details */}
          <ellipse cx="15" cy="79" rx="4" ry="2.5" fill="#4ade80" />
          <ellipse cx="23" cy="81" rx="4" ry="2.5" fill="#4ade80" />
          <ellipse cx="85" cy="79" rx="4" ry="2.5" fill="#4ade80" />
          <ellipse cx="77" cy="81" rx="4" ry="2.5" fill="#4ade80" />

          {/* Frog Main Body */}
          <ellipse cx="50" cy="58" rx="34" ry="28" fill="#22c55e" />
          
          {/* Light Green Belly Patch */}
          <ellipse cx="50" cy="64" rx="23" ry="19" fill="#86efac" />

          {/* Front cute little hands */}
          <ellipse cx="36" cy="72" rx="7" ry="5" fill="#16a34a" />
          <ellipse cx="64" cy="72" rx="7" ry="5" fill="#16a34a" />

          {/* Big Cartoon Eyes Background & Socket */}
          <circle cx="34" cy="29" r="15" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          <circle cx="66" cy="29" r="15" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />

          {/* Eye Whites */}
          <circle cx="34" cy="29" r="11" fill="#ffffff" />
          <circle cx="66" cy="29" r="11" fill="#ffffff" />

          {/* Eye Pupils (Looking slightly happy/curious) */}
          <circle
            cx={hasWon ? "34" : "36"}
            cy={isJumping ? "26" : "29"}
            r="6"
            fill="#0f172a"
          />
          <circle
            cx={hasWon ? "66" : "68"}
            cy={isJumping ? "26" : "29"}
            r="6"
            fill="#0f172a"
          />

          {/* Sparkle Reflection in Pupils */}
          <circle cx="37" cy="27" r="2.5" fill="#ffffff" />
          <circle cx="69" cy="27" r="2.5" fill="#ffffff" />
          <circle cx="33" cy="31" r="1.2" fill="#ffffff" />
          <circle cx="65" cy="31" r="1.2" fill="#ffffff" />

          {/* Cheerful Rosy Cheeks */}
          <circle cx="25" cy="54" r="5" fill="#fb7185" opacity="0.75" />
          <circle cx="75" cy="54" r="5" fill="#fb7185" opacity="0.75" />

          {/* Cute Smile / Expression */}
          {isSplashing ? (
            // Surprised "O" mouth when splashing
            <ellipse cx="50" cy="56" rx="6" ry="8" fill="#0f172a" />
          ) : hasWon ? (
            // Big joyful open grin
            <path
              d="M 36 53 Q 50 70 64 53 Z"
              fill="#be123c"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
          ) : (
            // Warm friendly curve smile
            <path
              d="M 38 56 Q 50 67 62 56"
              stroke="#0f172a"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Cute Nostrils */}
          <circle cx="46" cy="44" r="1.2" fill="#15803d" />
          <circle cx="54" cy="44" r="1.2" fill="#15803d" />
        </svg>

        {/* Small water ripple beneath the frog when resting */}
        {!isJumping && !isSplashing && (
          <div className="absolute -bottom-1 w-12 h-3 bg-emerald-400/20 rounded-[50%] blur-sm pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};
