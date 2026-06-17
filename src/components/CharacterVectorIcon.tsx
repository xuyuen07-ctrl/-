import React from 'react';

interface CharacterVectorIconProps {
  characterId: string;
  className?: string;
  size?: number | string;
  stacks?: number;
  gesture?: 'idle' | 'moving' | 'precast' | 'postcast';
  interactionState?: 'idle' | 'click' | 'hit';
}

export const CharacterVectorIcon: React.FC<CharacterVectorIconProps> = ({
  characterId,
  className = '',
  size = '100%',
  stacks = 0,
  gesture = 'idle',
  interactionState = 'idle',
}) => {
  const commonClasses = `inline-block shrink-0 ${className}`;

  if (characterId === 'angel') {
    // 0 to 5 stacks mapping
    const stackNum = Math.min(5, Math.max(0, stacks));
    
    // Core pulsing speed & scale based on passive layers
    let pulseClass = 'angel-pulse-0';
    let spinClass = 'angel-spin-slow';
    let bodyFill = 'url(#angelBodyGrad0)';
    let veinColor = '#fde047';
    let veinOpacity = 0.35;
    let haloGlowColor = 'rgba(252, 211, 77, 0.25)';
    let haloWidth = '1.2';
    let hasSpeckles = false;
    let eyePulse = '';
    let isMax = false;

    if (stackNum === 0) {
      pulseClass = 'angel-pulse-0';
      spinClass = 'angel-spin-slow';
      bodyFill = 'url(#angelBodyGrad0)';
      veinOpacity = 0.25;
      haloGlowColor = 'rgba(252, 211, 77, 0.2)';
    } else if (stackNum >= 1 && stackNum <= 4) {
      pulseClass = 'angel-pulse-mid';
      spinClass = 'angel-spin-mid';
      bodyFill = 'url(#angelBodyGradMid)';
      veinOpacity = 0.65;
      veinColor = '#fbbf24';
      haloGlowColor = 'rgba(251, 191, 36, 0.5)';
      haloWidth = '1.8';
    } else {
      // 5 stacks max
      pulseClass = 'angel-pulse-max';
      spinClass = 'angel-spin-fast';
      bodyFill = 'url(#angelBodyGradMax)';
      veinOpacity = 1.0;
      veinColor = '#f59e0b';
      haloGlowColor = 'rgba(245, 158, 11, 0.85)';
      haloWidth = '2.5';
      hasSpeckles = true;
      eyePulse = 'angel-eye-sparkle';
      isMax = true;
    }

    // Interactive Click/Hit overlays classes
    let animRootClass = 'angel-container-idle';
    if (interactionState === 'click') {
      animRootClass = 'angel-container-clicked';
    } else if (interactionState === 'hit') {
      animRootClass = 'angel-container-hit';
    }

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${commonClasses} ${animRootClass}`}
      >
        <defs>
          <style>{`
            @keyframes angel-bob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-3.5px); }
            }
            @keyframes angel-pulse-0 {
              0%, 100% { opacity: 0.45; transform: scale(0.95); }
              50% { opacity: 0.75; transform: scale(1.05); }
            }
            @keyframes angel-pulse-mid {
              0%, 100% { opacity: 0.6; transform: scale(0.9); }
              50% { opacity: 0.9; transform: scale(1.15); }
            }
            @keyframes angel-pulse-max {
              0%, 100% { opacity: 0.7; transform: scale(0.85); filter: drop-shadow(0 0 4px #fbbf24); }
              50% { opacity: 1.0; transform: scale(1.25); filter: drop-shadow(0 0 8px #f59e0b); }
            }
            @keyframes angel-spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes angel-spin-mid {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes angel-spin-fast {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes angel-eye-sparkle {
              0%, 100% { filter: drop-shadow(0 0 1px #ffffff); opacity: 0.8; }
              50% { filter: drop-shadow(0 0 5px #ffffff); opacity: 1.0; scale: 1.15; }
            }
            @keyframes angel-hand-idle-l {
              0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
              50% { transform: translate(-2px, -1px) rotate(-6deg); }
            }
            @keyframes angel-hand-idle-r {
              0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
              50% { transform: translate(2px, -1px) rotate(6deg); }
            }
            @keyframes angel-hand-move-l {
              0%, 100% { transform: translate(-1px, 2px) rotate(5deg); }
              50% { transform: translate(1px, -1px) rotate(8deg); }
            }
            @keyframes angel-hand-move-r {
              0%, 100% { transform: translate(1px, 2px) rotate(-5deg); }
              50% { transform: translate(-1px, -1px) rotate(-8deg); }
            }
            @keyframes angel-hand-precast-l {
              0%, 100% { transform: translate(6px, 4px) rotate(15deg); }
              50% { transform: translate(8px, 3px) rotate(18deg); }
            }
            @keyframes angel-hand-precast-r {
              0%, 100% { transform: translate(-6px, 4px) rotate(-15deg); }
              50% { transform: translate(-8px, 3px) rotate(-18deg); }
            }
            @keyframes angel-hand-postcast-l {
              0% { transform: scale(1) translate(0px, 0px); opacity: 1; }
              100% { transform: scale(1.1) translate(-6px, -4px); opacity: 0.7; }
            }
            @keyframes angel-hand-postcast-r {
              0% { transform: scale(1) translate(0px, 0px); opacity: 1; }
              100% { transform: scale(1.1) translate(6px, -4px); opacity: 0.7; }
            }
            @keyframes angel-click-overlay {
              0% { transform: scale(0.9); opacity: 0.9; }
              100% { transform: scale(1.4); opacity: 0; }
            }
            @keyframes angel-hit-flash {
              0% { fill: #ffffff; stroke: #ffffff; filter: brightness(2.0); }
              20% { fill: #ffffff; stroke: #ffffff; filter: brightness(2.0); }
              50% { filter: brightness(0.4); opacity: 0.6; }
              100% { filter: brightness(1.0); opacity: 1.0; }
            }
            @keyframes angel-sparkle-flow {
              0% { transform: scale(0.8) translate(0, 0); opacity: 0.2; }
              50% { transform: scale(1.2) translate(0, -3px); opacity: 0.9; }
              100% { transform: scale(0.8) translate(0, -6px); opacity: 0.1; }
            }
            .angel-bobber {
              animation: angel-bob 4s ease-in-out infinite;
              transform-origin: center center;
            }
            .angel-core-pulse-0 {
              animation: angel-pulse-0 3s ease-in-out infinite;
              transform-origin: 50px 55px;
            }
            .angel-core-pulse-mid {
              animation: angel-pulse-mid 1.8s ease-in-out infinite;
              transform-origin: 50px 55px;
            }
            .angel-core-pulse-max {
              animation: angel-pulse-max 0.8s ease-in-out infinite;
              transform-origin: 50px 55px;
            }
            .angel-spin-slow {
              animation: angel-spin-slow 6.5s linear infinite;
              transform-origin: 50px 24px;
            }
            .angel-spin-mid {
              animation: angel-spin-mid 4s linear infinite;
              transform-origin: 50px 24px;
            }
            .angel-spin-fast {
              animation: angel-spin-fast 2.2s linear infinite;
              transform-origin: 50px 24px;
            }
            .angel-hand-l-idle {
              animation: angel-hand-idle-l 3.5s ease-in-out infinite;
              transform-origin: 22px 55px;
            }
            .angel-hand-r-idle {
              animation: angel-hand-idle-r 3.5s ease-in-out infinite;
              transform-origin: 78px 55px;
            }
            .angel-hand-l-move {
              animation: angel-hand-move-l 1.2s ease-in-out infinite;
              transform-origin: 22px 55px;
            }
            .angel-hand-r-move {
              animation: angel-hand-move-r 1.2s ease-in-out infinite;
              transform-origin: 78px 55px;
            }
            .angel-hand-l-precast {
              animation: angel-hand-precast-l 0.8s ease-in-out infinite;
              transform-origin: 22px 55px;
            }
            .angel-hand-r-precast {
              animation: angel-hand-precast-r 0.8s ease-in-out infinite;
              transform-origin: 78px 55px;
            }
            .angel-hand-l-postcast {
              animation: angel-hand-postcast-l 0.6s ease-out infinite alternate;
              transform-origin: 22px 55px;
            }
            .angel-hand-r-postcast {
              animation: angel-hand-postcast-r 0.6s ease-out infinite alternate;
              transform-origin: 78px 55px;
            }
            .angel-container-clicked {
              animation: angel-bob 4s ease-in-out infinite;
            }
            .angel-container-hit {
              animation: angel-hit-flash 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) 1;
            }
            .angel-sparkle-dot {
              animation: angel-sparkle-flow 1.5s ease-in-out infinite;
            }
            .angel-click-ring-path {
              animation: angel-click-overlay 0.5s ease-out 1 forwards;
              transform-origin: 50px 55px;
            }
          `}</style>

          {/* Body Gradients */}
          <radialGradient id="angelBodyGrad0" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fefaf0" />
            <stop offset="100%" stopColor="#fbf5e6" />
          </radialGradient>
          <radialGradient id="angelBodyGradMid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fef7df" />
            <stop offset="100%" stopColor="#fdf1c0" />
          </radialGradient>
          <radialGradient id="angelBodyGradMax" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffff0" />
            <stop offset="40%" stopColor="#fdf1c0" />
            <stop offset="85%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>

          {/* Core Light Gradient */}
          <radialGradient id="angelCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#facc15" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#eab308" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>

          {/* Halo Glow Filter */}
          <filter id="haloGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Back Glow based on Stacks */}
        <circle cx="50" cy="55" r="32" fill={haloGlowColor} opacity="0.32" className="animate-pulse" />

        {/* --- DYNAMIC INTERACTIVE CLICK RIPPLE --- */}
        {interactionState === 'click' && (
          <circle cx="50" cy="55" r="22" fill="none" stroke="#ffffff" strokeWidth="2" className="angel-click-ring-path" />
        )}

        <g className="angel-bobber">
          {/* ================= BACKGROUND: HAND GESTURES (2D Light shadow hands) ================= */}
          {gesture === 'idle' && (
            <g>
              {/* Left hand idle */}
              <g className="angel-hand-l-idle">
                <path d="M 23 58 C 17 56, 11 50, 6 46 C 4 48, 4 52, 7 55 C 11 59, 16 63, 22 64 Z" fill="rgba(253, 224, 71, 0.45)" stroke="#fcd34d" strokeWidth="0.8" />
                <path d="M 12 52 L 5 44" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
                <path d="M 14 55 L 4 49" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
              </g>
              {/* Right hand idle */}
              <g className="angel-hand-r-idle">
                <path d="M 77 58 C 83 56, 89 50, 94 46 C 96 48, 96 52, 93 55 C 89 59, 84 63, 78 64 Z" fill="rgba(253, 224, 71, 0.45)" stroke="#fcd34d" strokeWidth="0.8" />
                <path d="M 88 52 L 95 44" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
                <path d="M 86 55 L 96 49" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
              </g>
            </g>
          )}

          {gesture === 'moving' && (
            <g>
              {/* Left hand moving - pointing forward */}
              <g className="angel-hand-l-move">
                <path d="M 24 57 C 19 51, 15 42, 14 34 C 16 33, 19 35, 21 39 C 24 45, 25 51, 25 56 Z" fill="rgba(253, 224, 71, 0.5)" stroke="#fcd34d" strokeWidth="0.8" />
                <path d="M 17 38 L 13 28 " stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
                <path d="M 21 36 L 19 26 " stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
              </g>
              {/* Right hand moving - pointing forward */}
              <g className="angel-hand-r-move">
                <path d="M 76 57 C 81 51, 85 42, 86 34 C 84 33, 81 35, 79 39 C 76 45, 75 51, 75 56 Z" fill="rgba(253, 224, 71, 0.5)" stroke="#fcd34d" strokeWidth="0.8" />
                <path d="M 83 38 L 87 28 " stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
                <path d="M 79 36 L 81 26 " stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
              </g>
            </g>
          )}

          {gesture === 'precast' && (
            <g>
              {/* Left hand crossed */}
              <g className="angel-hand-l-precast">
                <path d="M 24 60 C 27 54, 32 47, 39 42 C 40 44, 39 48, 35 52 C 30 57, 26 61, 23 62 Z" fill="rgba(251, 191, 36, 0.55)" stroke="#fbbf24" strokeWidth="1.0" />
                <path d="M 33 46 L 39 37 M 36 49 L 43 41" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
              </g>
              {/* Right hand crossed */}
              <g className="angel-hand-r-precast">
                <path d="M 76 60 C 73 54, 68 47, 61 42 C 60 44, 61 48, 65 52 C 70 57, 74 61, 77 62 Z" fill="rgba(251, 191, 36, 0.55)" stroke="#fbbf24" strokeWidth="1.0" />
                <path d="M 67 46 L 61 37 M 64 49 L 57 41" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
              </g>
            </g>
          )}

          {gesture === 'postcast' && (
            <g>
              {/* Left hand bursting wide out */}
              <g className="angel-hand-l-postcast">
                <path d="M 21 59 C 14 55, 6 45, 2 36 C 1 38, 2 43, 5 47 C 10 53, 16 58, 21 60 Z" fill="rgba(251, 191, 36, 0.45)" stroke="#f59e0b" strokeWidth="0.9" />
                <line x1="6" y1="41" x2="1" y2="33" stroke="#fde047" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="44" x2="4" y2="36" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              {/* Right hand bursting wide out */}
              <g className="angel-hand-r-postcast">
                <path d="M 79 59 C 86 55, 94 45, 98 36 C 99 38, 98 43, 95 47 C 90 53, 84 58, 79 60 Z" fill="rgba(251, 191, 36, 0.45)" stroke="#f59e0b" strokeWidth="0.9" />
                <line x1="94" y1="41" x2="99" y2="33" stroke="#fde047" strokeWidth="1" strokeLinecap="round" />
                <line x1="90" y1="44" x2="96" y2="36" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              {/* Extra light particle spots flying around */}
              <circle cx="16" cy="38" r="1.2" fill="#ffffff" className="angel-sparkle-dot" />
              <circle cx="84" cy="38" r="1.2" fill="#ffffff" className="angel-sparkle-dot" />
              <circle cx="24" cy="28" r="1.0" fill="#fde047" className="angel-sparkle-dot" style={{ animationDelay: '0.4s' }} />
              <circle cx="76" cy="28" r="1.0" fill="#fde047" className="angel-sparkle-dot" style={{ animationDelay: '0.4s' }} />
            </g>
          )}

          {/* ================= HIGH-END HEAD HALO (頭頂光環) ================= */}
          <g className={spinClass}>
            {/* Suspended thin golden circle floating above sphere */}
            <ellipse
              cx="50"
              cy="24"
              rx="15"
              ry="3.5"
              fill="none"
              stroke={veinColor}
              strokeWidth={haloWidth}
              filter="url(#haloGlow)"
            />
            {/* Max stacks: add sparkling particles near halo body */}
            {hasSpeckles && (
              <g>
                <circle cx="35" cy="24" r="1.0" fill="#ffffff" className="animate-pulse" />
                <circle cx="65" cy="24" r="1.0" fill="#ffffff" className="animate-pulse" />
                <polygon points="50 20.5, 51 22, 50 23.5, 49 22" fill="#ffffff" />
                <polygon points="50 27.5, 51 26, 50 24.5, 49 26" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* ================= MAIN SPHERE SPHERICAL BODY ================= */}
          <circle
            cx="50"
            cy="55"
            r="22"
            fill={bodyFill}
            stroke="#fcd34d"
            strokeWidth="1.8"
            style={{ strokeLinejoin: 'round' }}
          />

          {/* Max stacks: warm orange/gold overlay dye */}
          {isMax && (
            <circle cx="50" cy="55" r="22" fill="rgba(251, 191, 36, 0.18)" stroke="none" />
          )}

          {/* ================= SPHERICAL VEINS (光翼紋路 - Symmetrical) ================= */}
          <g opacity={veinOpacity} stroke={veinColor} strokeWidth="1.0" strokeLinecap="round">
            {/* Top branch wings pattern */}
            <path d="M 50 55 C 46 45, 40 40, 31 38" fill="none" />
            <path d="M 50 55 C 54 45, 60 40, 69 38" fill="none" />
            {/* Middle branch wings pattern */}
            <path d="M 50 55 C 42 53, 35 48, 29 49" fill="none" />
            <path d="M 50 55 C 58 53, 65 48, 71 49" fill="none" />
            {/* Bottom branch wings pattern */}
            <path d="M 50 55 C 43 62, 36 67, 32 71" fill="none" />
            <path d="M 50 55 C 57 62, 64 67, 68 71" fill="none" />
          </g>

          {/* ================= GOLD PULSING CORE (亮金光核) ================= */}
          <g className={
            stackNum === 0 ? 'angel-core-pulse-0' :
            stackNum < 5 ? 'angel-core-pulse-mid' : 'angel-core-pulse-max'
          }>
            {/* Core sphere centered in main ball - occupying 1/4 diameter (radius ~ 5.5px) */}
            <circle
              cx="50"
              cy="55"
              r={stackNum === 0 ? 5.2 : stackNum < 5 ? 6.2 : 7.2}
              fill="url(#angelCoreGrad)"
            />
          </g>

          {/* ================= SHADOW IN THE BOTTOM HALF (立體扁平陰影) ================= */}
          <path
            d="M 28 55 A 22 22 0 0 0 72 55"
            fill="none"
            stroke="#e4e4e7"
            strokeWidth="1.5"
            opacity="0.16"
          />

          {/* ================= MENACING EYE SIGNALS (不含贅線眼部雙點) ================= */}
          <g>
            {/* 左右對稱小眼睛 (Solid golden amber circles) */}
            <circle
              cx="41.5"
              cy="44"
              r="2.0"
              fill="#fbbf24"
              stroke="#ca8a04"
              strokeWidth="0.4"
              className={eyePulse}
            />
            <circle
              cx="58.5"
              cy="44"
              r="2.0"
              fill="#fbbf24"
              stroke="#ca8a04"
              strokeWidth="0.4"
              className={eyePulse}
            />
          </g>
        </g>
      </svg>
    );
  }

  if (characterId === 'vampire') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="vampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3a0000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vampWings" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3333" />
            <stop offset="40%" stopColor="#990000" />
            <stop offset="100%" stopColor="#4a0000" />
          </linearGradient>
          <linearGradient id="gothicCrescent" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a0000" />
            <stop offset="100%" stopColor="#0a0000" />
          </linearGradient>
        </defs>
        {/* Ambient Dark Pulsing Glow */}
        <circle cx="50" cy="50" r="46" fill="url(#vampGlow)" className="animate-pulse" />
        
        {/* Outer Circular Gothic Crown Ring */}
        <circle cx="50" cy="50" r="33" fill="url(#gothicCrescent)" stroke="#ff3333" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="35.5" fill="none" stroke="#ff3333" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 4" />
        
        {/* Gothic Pentagram-like Star Accents */}
        <path d="M50 19 L54 30 L65 30 L56 36 L60 47 L50 41 L40 47 L44 36 L35 30 L46 30 Z" fill="#ff4d4d" fillOpacity="0.06" />

        {/* Dynamic bat wings curvature */}
        <path
          d="M50 35 C42 21, 25 21, 16 31 C25 38, 35 37, 43 42 C41 51, 45 57, 50 61 C55 57, 59 51, 57 42 C65 37, 75 38, 84 31 C75 21, 58 21, 50 35 Z"
          fill="url(#vampWings)"
          stroke="#ff4d4d"
          strokeWidth="1.5"
        />

        {/* Blood Crest Emblem Center */}
        <path d="M50 43 L47 47 L53 47 Z" fill="#ffffff" />
        {/* Vampire Sharp Fangs */}
        <path d="M44 47 L43 47 L43.5 52 Z" fill="#ffffff" stroke="#ff3333" strokeWidth="0.5" />
        <path d="M56 47 L57 47 L56.5 52 Z" fill="#ffffff" stroke="#ff3333" strokeWidth="0.5" />

        {/* Glowing Demonic Crimson Eyes */}
        <circle cx="44" cy="41" r="2" fill="#ffea00" />
        <circle cx="44" cy="41" r="0.8" fill="#ff0000" />
        <circle cx="56" cy="41" r="2" fill="#ffea00" />
        <circle cx="56" cy="41" r="0.8" fill="#ff0000" />
        
        {/* Floating blood spark particles */}
        <circle cx="50" cy="27" r="1.2" fill="#ff3333" />
        <circle cx="32" cy="44" r="1" fill="#ff4d4d" />
        <circle cx="68" cy="44" r="1" fill="#ff4d4d" />
      </svg>
    );
  }

  if (characterId === 'mud') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="mudGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mudStone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="stoneGleam" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" opacity="0.1" />
          </linearGradient>
        </defs>
        {/* Glow Background */}
        <circle cx="50" cy="50" r="45" fill="url(#mudGlow)" />
        
        {/* Earth Shield Ring Structure */}
        <circle cx="50" cy="50" r="33" fill="#2d1500" stroke="#f59e0b" strokeWidth="2.5" />
        {/* Outer Tech Bracket segments */}
        <path d="M 50 13 A 37 37 0 0 1 87 50" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 50 87 A 37 37 0 0 1 13 50" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Rugged Octagonal Geology Block Shield */}
        <polygon
          points="74.5 50, 69.3 69.3, 50 74.5, 34.6 65.4, 25.5 50, 30.7 30.7, 50 25.5, 65.4 34.6"
          fill="url(#mudStone)"
          stroke="#451a03"
          strokeWidth="2.5"
        />
        {/* Shading/Gleam Layer details for 3D octagon face */}
        <polygon
          points="50 25.5, 65.4 34.6, 50 50, 30.7 30.7"
          fill="url(#stoneGleam)"
          opacity="0.35"
        />
        <polygon
          points="25.5 50, 50 50, 34.6 65.4"
          fill="#000000"
          opacity="0.15"
        />
        <polygon
          points="74.5 50, 50 50, 69.3 69.3"
          fill="#ffffff"
          opacity="0.1"
        />

        {/* Glowing Gold Earth Fissure Rune lines */}
        <path
          d="M34 45 L50 38 L50 67 L66 59 M50 51 L66 43"
          stroke="#fef08a"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
        {/* Glowing central crystal node */}
        <circle cx="50" cy="51" r="3.5" fill="#fef08a" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'blaze') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="blazeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff781f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="45%" stopColor="#ea580c" />
            <stop offset="75%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <linearGradient id="nestedFlame" x1="0%" y1="90%" x2="0%" y2="10%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fffbeb" />
          </linearGradient>
        </defs>
        {/* Blaze Halo Glow */}
        <circle cx="50" cy="50" r="46" fill="url(#blazeGlow)" className="animate-pulse" />
        
        {/* Internal Fire Vessel Ring */}
        <circle cx="50" cy="50" r="33" fill="#4c0519" stroke="#f97316" strokeWidth="2.5" />
        {/* Outer Sparks Ring */}
        <circle cx="50" cy="50" r="36.5" fill="none" stroke="#facc15" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 6" />

        {/* Dynamic Flame Star with Spike Protrusions */}
        <polygon
          points="78 50, 63 59.4, 58.7 76.6, 45 65.2, 27.3 66.5, 34 50, 27.3 33.5, 45 34.8, 58.7 23.4, 63 40.6"
          fill="url(#flameGrad)"
          stroke="#7c2d12"
          strokeWidth="1.5"
        />

        {/* Nested Energetic Core Flame Star */}
        <polygon
          points="65 50, 57.3 55.3, 54.6 64.3, 47.2 58.6, 37.8 59.3, 41 50, 37.8 40.7, 47.2 41.4, 44.6 35.7, 57.3 44.7"
          fill="url(#nestedFlame)"
          opacity="0.9"
        />

        {/* Vivid core spark center of pure plasma */}
        <ellipse cx="50" cy="53" rx="4.5" ry="9" fill="#ffffff" />
        <ellipse cx="50" cy="53" rx="2" ry="5.5" fill="#facc15" />

        {/* Floating Sparks inside details */}
        <circle cx="38" cy="56" r="1.5" fill="#facc15" />
        <circle cx="62" cy="56" r="1.5" fill="#facc15" />
        <circle cx="50" cy="39" r="1.2" fill="#ffffff" />
      </svg>
    );
  }

  if (characterId === 'lightning') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="stormGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="electricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="accentStrike" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Glow Ambient Storm Cloud */}
        <circle cx="50" cy="50" r="46" fill="url(#stormGlow)" />
        
        {/* 8-pronged sharp electric stator gear tooths */}
        <polygon
          points="81 50, 60 60, 50 81, 40 60, 19 50, 40 40, 50 19, 60 40"
          fill="#082f49"
          stroke="#06b6d4"
          strokeWidth="2.5"
        />
        <polygon
          points="84 50, 62 62, 50 84, 38 62, 16 50, 38 38, 50 16, 62 38"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.3"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Dynamic Storm Wind Spiral Vortices */}
        <path
          d="M26 50 C26 36.7 36.7 26 50 26 C58 26 65 30 70 36 M74 50 C74 63.3 63.3 74 50 74 C42 74 35 70 30 64"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Dual Neon Bolt Zig-Zags */}
        <path
          d="M55 23 L40 44 L53 44 L44 75 L62 49 L48 49 Z"
          fill="url(#electricGrad)"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        
        {/* Core hot glowing strike center */}
        <path
          d="M53 30 L43 44 L51 44 L46 64 L56 49 L48 49 Z"
          fill="url(#accentStrike)"
          opacity="0.9"
        />

        {/* Ambient storm bolts inside details */}
        <circle cx="34" cy="38" r="1.5" fill="#38bdf8" className="animate-pulse" />
        <circle cx="66" cy="62" r="1.5" fill="#38bdf8" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'dice') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="diceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="metalDice" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="innerGlassShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Glow Aura */}
        <circle cx="50" cy="50" r="46" fill="url(#diceGlow)" />
        
        {/* Sleek Slate Border Shield Ring */}
        {/* Draw isometric hexagon dice wrapper */}
        <polygon
          points="50 16, 79.5 33, 79.5 67, 50 84, 20.5 67, 20.5 33"
          fill="#1e293b"
          stroke="#94a3b8"
          strokeWidth="2.5"
        />

        {/* 3D Isometric Perspective Panels */}
        {/* Top panel */}
        <polygon
          points="50 50, 79.5 33, 50 16, 20.5 33"
          fill="url(#metalDice)"
          stroke="#64748b"
          strokeWidth="1.2"
        />
        {/* Left panel */}
        <polygon
          points="50 50, 20.5 33, 20.5 67, 50 84"
          fill="#cbd5e1"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />
        {/* Right panel */}
        <polygon
          points="50 50, 50 84, 79.5 67, 79.5 33"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1.2"
        />

        {/* Dice Pip Indicators on visible 3D panels */}
        {/* Top panel pips */}
        <circle cx="36" cy="30" r="3.2" fill="#0f172a" />
        <circle cx="64" cy="30" r="3.2" fill="#0f172a" />

        {/* Left panel pips */}
        <circle cx="34" cy="48" r="3.2" fill="#0f172a" />
        <circle cx="34" cy="62" r="3.2" fill="#0f172a" />

        {/* Right panel jackpot pip - Golden Glow Core! */}
        <circle cx="65.5" cy="55" r="4.8" fill="#facc15" stroke="#d97706" strokeWidth="1" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'gravity') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="gravityGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="spacetimeGrid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
        </defs>
        {/* Glow Aura of Spacetime Distortion */}
        <circle cx="50" cy="50" r="47" fill="url(#gravityGlow)" className="animate-pulse" />
        
        {/* High-Tension Spiral Accretion Nebula Coils */}
        <path
          d="M 50 50 A 5 5 0 0 1 55 55 A 10 10 0 0 1 45 60 A 15 15 0 0 1 35 45 A 20 20 0 0 1 50 30 A 25 25 0 0 1 75 50 A 30 30 0 0 1 50 80 A 34 34 0 0 1 16 50"
          stroke="#818cf8"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Event Horizon Central singularity */}
        <circle cx="50" cy="50" r="23" fill="#02021e" stroke="#6366f1" strokeWidth="1.5" />
        
        {/* Orbit disk rings spinning around gravity center */}
        <ellipse cx="50" cy="50" rx="42" ry="11" stroke="#6366f1" strokeOpacity="0.5" strokeWidth="1.5" transform="rotate(-28 50 50)" strokeDasharray="3 4" />
        <ellipse cx="50" cy="50" rx="42" ry="11" stroke="#a5b4fc" strokeOpacity="0.5" strokeWidth="1.2" transform="rotate(28 50 50)" strokeDasharray="4 2" />

        {/* Deep Dimensional Black Hole Singularity */}
        <circle cx="50" cy="50" r="16" fill="#000000" stroke="#818cf8" strokeWidth="1" />
        <circle cx="50" cy="50" r="10" fill="#000000" />

        {/* Spacetime Fissure distortion pattern */}
        <path
          d="M 37 42 L 47 48 L 53 52 L 63 48 M 40 45 L 47 49 L 53 51 L 60 49"
          stroke="url(#spacetimeGrid)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Sparkly nebula stars inside event horizon */}
        <circle cx="41" cy="35" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="59" cy="34" r="1.0" fill="#a5b4fc" opacity="0.9" />
        <circle cx="62" cy="56" r="1.5" fill="#ffffff" opacity="0.7" />
        <circle cx="38" cy="57" r="1.2" fill="#818cf8" opacity="0.9" />
      </svg>
    );
  }

  if (characterId === 'phantom') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="phanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2e0249" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="phanMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="55%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="phanSplit" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {/* Glow Aura of Holographic splitting */}
        <circle cx="50" cy="50" r="46" fill="url(#phanGlow)" className="animate-pulse" />
        
        {/* Hollowed Spooky Crescent Ring */}
        <path
          d="M50 18 A32 32 0 1 1 50 82 A23 32 0 0 0 50 18"
          fill="url(#phanMain)"
          stroke="#e879f9"
          strokeWidth="2.5"
        />
        <circle cx="50" cy="50" r="36" stroke="#e879f9" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" />

        {/* Left Side Quantum Mask Specular wing inside crescent */}
        <path
          d="M48 24 Q32 28 34 50 Q36 68 48 76 Q42 58 44 44 Z"
          fill="url(#phanSplit)"
          stroke="#c084fc"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Central Quantum Split line sparkles */}
        <line x1="50" y1="21" x2="50" y2="79" stroke="#f472b6" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
        
        {/* Core Pulsing Sparkle node of quantum entanglement */}
        <polygon points="50 43, 53.5 50, 50 57, 46.5 50" fill="#ffffff" className="animate-pulse" />
        
        {/* Spark glow dots */}
        <circle cx="38" cy="46" r="1.5" fill="#f472b6" />
        <circle cx="62" cy="46" r="1.5" fill="#a5b4fc" />
      </svg>
    );
  }

  if (characterId === 'cat') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="catGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fafaf9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="catBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fafaf9" />
            <stop offset="100%" stopColor="#f5f5f4" />
          </linearGradient>
          <linearGradient id="tiaraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        {/* Ambient Dreamy Amethyst Glow */}
        <circle cx="50" cy="50" r="47" fill="url(#catGlow)" />

        {/* Circular Lace Princess Frame */}
        <circle cx="50" cy="50" r="33" fill="#fafaf9" stroke="#c084fc" strokeWidth="2.0" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#fbcfe8" strokeWidth="1.0" strokeDasharray="2 3" />

        {/* Left Pointy Cat Ear (Furry Outer) */}
        <path d="M28 36 L20 18 L38 29 Z" fill="#fafaf9" stroke="#e9d5ff" strokeWidth="1" />
        {/* Left Ear Inner Pink Pad */}
        <path d="M29 33 L23 21 L35 28 Z" fill="#fbcfe8" />

        {/* Right Pointy Cat Ear (Furry Outer) */}
        <path d="M72 36 L80 18 L62 29 Z" fill="#fafaf9" stroke="#e9d5ff" strokeWidth="1" />
        {/* Right Ear Inner Pink Pad */}
        <path d="M71 33 L77 21 L65 28 Z" fill="#fbcfe8" />

        {/* White Main Cat fluffy bread loaf body */}
        <path d="M50 29 C56 29, 66 33, 73 40 C75 43, 75 49, 74 53 C71 61, 62 67, 50 67 C38 67, 29 61, 26 53 C25 49, 25 43, 27 40 C34 33, 44 29, 50 29 Z" fill="url(#catBodyGrad)" stroke="#e4e4e7" strokeWidth="1" />

        {/* Golden Princess Tiara on her head */}
        <path d="M43 27 L45 22 L50 25 L55 22 L57 27 Z" fill="url(#tiaraGrad)" stroke="#ca8a04" strokeWidth="0.8" />
        <circle cx="50" cy="21.5" r="1.2" fill="#ef4444" /> {/* Tiny ruby on crown */}

        {/* Amethyst Eyes (紫水晶大圓瞳) */}
        {/* Left eye */}
        <circle cx="41" cy="48" r="4.2" fill="#c084fc" />
        <circle cx="41" cy="48" r="2.8" fill="#a855f7" />
        <circle cx="39.5" cy="46.5" r="1.3" fill="#ffffff" /> {/* Glint */}
        <circle cx="42.5" cy="49.5" r="0.6" fill="#ffffff" />

        {/* Right eye */}
        <circle cx="59" cy="48" r="4.2" fill="#c084fc" />
        <circle cx="59" cy="48" r="2.8" fill="#a855f7" />
        <circle cx="57.5" cy="46.5" r="1.3" fill="#ffffff" /> {/* Glint */}
        <circle cx="60.5" cy="49.5" r="0.6" fill="#ffffff" />

        {/* Delicate lash details */}
        <path d="M35 45 C38 43, 44 44, 46 45" stroke="#701a75" strokeWidth="1" strokeLinecap="round" />
        <path d="M65 45 C62 43, 56 44, 54 45" stroke="#701a75" strokeWidth="1" strokeLinecap="round" />

        {/* Cute small pink nose */}
        <path d="M50 54 L48 52 L52 52 Z" fill="#f472b6" />

        {/* Whiskers */}
        <line x1="33" y1="55" x2="21" y2="52" stroke="#cbd5e1" strokeWidth="0.8" />
        <line x1="33" y1="57.5" x2="20" y2="58" stroke="#cbd5e1" strokeWidth="0.8" />
        <line x1="67" y1="55" x2="79" y2="52" stroke="#cbd5e1" strokeWidth="0.8" />
        <line x1="67" y1="57.5" x2="80" y2="58" stroke="#cbd5e1" strokeWidth="0.8" />

        {/* Smiling Cat Mouth */}
        <path d="M47 56.5 Q50 58 50 56.5 Q50 58 53 56.5" stroke="#f472b6" strokeWidth="1" strokeLinecap="round" />

        {/* Blush Cheeks */}
        <circle cx="35" cy="53" r="3" fill="#fdbaf8" opacity="0.45" />
        <circle cx="65" cy="53" r="3" fill="#fdbaf8" opacity="0.45" />
      </svg>
    );
  }

  if (characterId === 'snake') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="snakeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="snakeSerpent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* Ethereal Green Mist Aura */}
        <circle cx="50" cy="50" r="47" fill="url(#snakeGlow)" className="animate-pulse" />

        {/* Outer concentric segmented serpent rings */}
        <circle cx="50" cy="50" r="33" fill="#021d15" stroke="#10b981" strokeWidth="2" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="5 7" />

        {/* Coiled Serpent multi-segment back body representation */}
        <path d="M50 17 A27 27 0 0 1 77 44 A27 27 0 0 1 50 71 A27 27 0 0 1 23 44" stroke="#064e3b" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M50 20 A23 23 0 0 1 73 43 A23 23 0 0 1 50 66 A23 23 0 0 1 27 43" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2" />

        {/* Diamond Shaped Dragon/Serpent Core Head */}
        <path
          d="M50 25 L68 47 L50 69 L32 47 Z"
          fill="url(#snakeSerpent)"
          stroke="#064e3b"
          strokeWidth="2.0"
        />

        {/* Scaly geometric patterns on forehead (墨青鱗紋) */}
        <path d="M50 29 L55 35 L45 35 Z" fill="#042f2e" opacity="0.35" />
        <path d="M50 35 L58 45 L42 45 Z" fill="#042f2e" opacity="0.25" />
        <path d="M50 45 L54 50 L46 50 Z" fill="#042f2e" opacity="0.4" />

        {/* Glowing Amber Slit-Eyes (琥珀色銳利直瞳) */}
        {/* Left eye */}
        <polygon points="39 42, 45 44, 43 49, 37 46" fill="#f59e0b" stroke="#042f2e" strokeWidth="0.8" />
        <line x1="41" y1="42.5" x2="41" y2="48" stroke="#000000" strokeWidth="1.2" /> {/* Slit */}

        {/* Right eye */}
        <polygon points="61 42, 55 44, 57 49, 63 46" fill="#f59e0b" stroke="#042f2e" strokeWidth="0.8" />
        <line x1="59" y1="42.5" x2="59" y2="48" stroke="#000000" strokeWidth="1.2" /> {/* Slit */}

        {/* Forked red snake tongue emerging from mouth */}
        <path d="M50 61 L50 71 L47 74 M50 71 L53 74" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />

        {/* Twin white poisonous fangs */}
        <polygon points="46 54, 48 54, 47 58" fill="#ffffff" />
        <polygon points="52 54, 54 54, 53 58" fill="#ffffff" />
      </svg>
    );
  }

  if (characterId === 'grid9') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="grid9Glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#090514" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="grid9Heavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Golden Matrix Glow */}
        <circle cx="50" cy="50" r="46" fill="url(#grid9Glow)" />

        {/* Cyberpunk rounded digital processor matrix block rounded square */}
        <rect x="17" y="17" width="66" height="66" rx="10" fill="url(#grid9Heavy)" stroke="url(#goldTrim)" strokeWidth="2.5" />
        <rect x="14" y="14" width="72" height="72" rx="12" fill="none" stroke="#d97706" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="4 4" />

        {/* 3x3 Magic Square Golden Grid Lines */}
        <g opacity="0.85">
          {/* Horizontal lines */}
          <line x1="28" y1="39" x2="72" y2="39" stroke="url(#goldTrim)" strokeWidth="1.2" />
          <line x1="28" y1="61" x2="72" y2="61" stroke="url(#goldTrim)" strokeWidth="1.2" />

          {/* Vertical lines */}
          <line x1="39" y1="28" x2="39" y2="72" stroke="url(#goldTrim)" strokeWidth="1.2" />
          <line x1="61" y1="28" x2="61" y2="72" stroke="url(#goldTrim)" strokeWidth="1.2" />
        </g>

        {/* Standard Silver numbers in grid slots: 4, 9, 2, 3, 5, 7, 8, 1, 6 (classic Luoshu grid) */}
        {/* Row 1 */}
        <text x="33.5" y="34.5" fill="#f1f5f9" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">4</text>
        <text x="50" y="34.5" fill="#fbbf24" fontSize="8.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif" className="animate-pulse">9</text>
        <text x="66.5" y="34.5" fill="#f1f5f9" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">2</text>

        {/* Row 2 */}
        <text x="33.5" y="50" fill="#f1f5f9" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">3</text>
        <text x="50" y="50" fill="#ffffff" fontSize="9.5" fontWeight="black" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">5</text>
        <text x="66.5" y="50" fill="#f1f5f9" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">7</text>

        {/* Row 3 */}
        <text x="33.5" y="65.5" fill="#f1f5f9" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">8</text>
        <text x="50" y="65.5" fill="#fbbf24" fontSize="8.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif" className="animate-pulse">1</text>
        <text x="66.5" y="65.5" fill="#f1f5f9" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">6</text>

        {/* Shiny metal outer rivets */}
        <circle cx="50" cy="13.5" r="1.5" fill="#fbbf24" />
        <circle cx="50" cy="86.5" r="1.5" fill="#fbbf24" />
        <circle cx="13.5" cy="50" r="1.5" fill="#fbbf24" />
        <circle cx="86.5" cy="50" r="1.5" fill="#fbbf24" />
      </svg>
    );
  }

  if (characterId === 'water_dragon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="waterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="waterBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="dragonHorn" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* Ambient flowing water glow */}
        <circle cx="50" cy="50" r="47" fill="url(#waterGlow)" />

        {/* Dragon head ornament protruding on top */}
        <path d="M42 22 L50 6 L58 22 Z" fill="url(#dragonHorn)" stroke="#0284c7" strokeWidth="1" />
        <path d="M46 22 L50 11 L54 22 Z" fill="#ffffff" opacity="0.6" />

        {/* Scaled Background Fins Protruding */}
        <path d="M 38 37 L 18 19 L 30 45 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M 62 37 L 82 19 L 70 45 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

        {/* Outer concentric fluid waves */}
        <circle cx="50" cy="50" r="33" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2.0" />
        <path d="M19 50 Q31 42, 50 50 T81 50" stroke="#0ea5e9" strokeWidth="1.0" strokeDasharray="3 3" />

        {/* Hydrodynamic fluid teardrop dragon pearl body */}
        <path d="M50 30 C56 40, 73 45, 73 54 C73 63, 62 72, 50 72 C38 72, 27 63, 27 54 C27 45, 44 40, 50 30 Z" fill="url(#waterBody)" stroke="#0ea5e9" strokeWidth="1.2" />

        {/* Water wave texture lines overlay on the body */}
        <path d="M32 48 Q41 53, 50 48 T68 48" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" strokeLinecap="round" />
        <path d="M35 55 Q42 60, 50 55 T65 55" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
        <path d="M38 62 Q44 65, 50 62 T62 62" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />

        {/* Blue dragon scales lines on the sides */}
        <path d="M30 46 C28 49, 29 53, 31 55 M29 50 C27 52, 28 55, 30 57" stroke="#0284c7" strokeWidth="1.0" strokeLinecap="round" />
        <path d="M70 46 C72 49, 71 53, 69 55 M71 50 C73 52, 72 55, 70 57" stroke="#0284c7" strokeWidth="1.0" strokeLinecap="round" />

        {/* Glowing Water crystal forehead gem */}
        <polygon points="50 34, 53.5 40, 50 46, 46.5 40" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.8" />
        <circle cx="50" cy="40" r="1.5" fill="#0ea5e9" className="animate-pulse" />

        {/* Flowing Water Dragon eyes */}
        <circle cx="41" cy="49" r="2.5" fill="#e0f2fe" />
        <circle cx="41" cy="49" r="1.2" fill="#0284c7" />
        <circle cx="59" cy="49" r="2.5" fill="#e0f2fe" />
        <circle cx="59" cy="49" r="1.2" fill="#0284c7" />

        {/* Small floating droplets around the ball */}
        <circle cx="21" cy="30" r="1.5" fill="#7dd3fc" opacity="0.8" />
        <circle cx="79" cy="30" r="1.5" fill="#7dd3fc" opacity="0.8" />
        <circle cx="16" cy="54" r="2.0" fill="#38bdf8" opacity="0.9" />
        <circle cx="84" cy="54" r="2.0" fill="#38bdf8" opacity="0.9" />
        <circle cx="34" cy="74" r="1.2" fill="#e0f2fe" opacity="0.7" />
        <circle cx="66" cy="74" r="1.2" fill="#e0f2fe" opacity="0.7" />
      </svg>
    );
  }

  if (characterId === 'whip') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="whipGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2e1065" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="whipBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="45%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#581c87" />
          </linearGradient>
        </defs>
        {/* Soft violet fog aura */}
        <circle cx="50" cy="50" r="47" fill="url(#whipGlow)" className="animate-pulse" />

        {/* Circular boundary ring */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="#d8b4fe" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />

        {/* Dynamic Curved Star Triple-Scythe Ribbon Rotor! */}
        <path
          d="M50 50 C40 28, 60 28, 50 18 C38 35, 38 45, 50 50 C71 61, 61 78, 77 65 C55 60, 48 58, 50 50 C29 61, 39 78, 23 65 C45 60, 52 58, 50 50 Z"
          fill="url(#whipBody)"
          stroke="#ebd5ff"
          strokeWidth="1.8"
        />

        {/* Coiled silver wire tail overlay */}
        <path
          d="M 50 23 C 65 23, 73 35, 67 52 Q 58 68 45 55"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
          fill="none"
        />

        {/* Curved silver star line textures on body */}
        <path d="M38 46 Q47 41, 56 48" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
        <path d="M41 53 Q50 51, 59 55" stroke="#ffffff" strokeWidth="1.0" opacity="0.6" strokeLinecap="round" />

        {/* Mystic glowing eyes */}
        <circle cx="43" cy="49" r="2.2" fill="#faf5ff" />
        <circle cx="43" cy="49" r="1.0" fill="#a855f7" />
        <circle cx="57" cy="49" r="2.2" fill="#faf5ff" />
        <circle cx="57" cy="49" r="1.0" fill="#a855f7" />

        {/* Silver Rhombus Whip Tip (鞭尖呈菱形銳角) */}
        <polygon
          points="47 38, 50 33, 47 28, 44 33"
          fill="#f1f5f9"
          stroke="#a855f7"
          strokeWidth="0.8"
        />

        {/* Fluorescent floating sparkling spots */}
        <circle cx="75" cy="28" r="1.5" fill="#f5d0fe" className="animate-pulse" />
        <circle cx="28" cy="74" r="1.5" fill="#f5d0fe" className="animate-pulse" />
        <circle cx="82" cy="55" r="1.2" fill="#ffffff" />
        <circle cx="20" cy="42" r="1.2" fill="#ffffff" />
      </svg>
    );
  }

  if (characterId === 'cosmic_mage') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nebulaBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="40%" stopColor="#312e81" />
            <stop offset="80%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        
        {/* Base Glow */}
        <circle cx="50" cy="50" r="47" fill="url(#cosmicGlow)" />

        {/* Mystical 4-pointed void space star nebula body */}
        <path d="M50 30 L55 45 L73 48 L56 53 L50 71 L44 53 L27 48 L45 45 Z" fill="url(#nebulaBody)" stroke="#38bdf8" strokeWidth="1.5" />
        
        {/* Mage Hat (Triangular) */}
        <path d="M50 15 L35 40 L65 40 Z" fill="#1e1b4b" stroke="#67e8f9" strokeWidth="1" />
        <circle cx="50" cy="40" r="2" fill="#67e8f9" />

        {/* Magical Star Eyes */}
        <circle cx="42" cy="50" r="3" fill="#ffffff" />
        <circle cx="58" cy="50" r="3" fill="#ffffff" />
        <polygon points="42 48, 43 50, 42 52, 41 50" fill="#22d3ee" />
        <polygon points="58 48, 59 50, 58 52, 57 50" fill="#22d3ee" />

        {/* Winding stardust ribbon */}
        <path d="M 33 55 C 40 48, 60 68, 67 55" stroke="#22d3ee" strokeWidth="2.0" strokeLinecap="round" opacity="0.8" />
        
        {/* Floating star sparks */}
        <circle cx="28" cy="35" r="1.5" fill="#ffffff" className="animate-pulse" />
        <circle cx="72" cy="35" r="1.5" fill="#ffffff" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'conductor') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="conductorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="railBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldCapTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Ambient Railway Glow */}
        <circle cx="50" cy="50" r="47" fill="url(#conductorGlow)" />

        {/* Conductor Circular Outer Cap Frame */}
        <circle cx="50" cy="50" r="33" fill="#0f172a" stroke="#3b82f6" strokeWidth="2.0" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#2563eb" strokeWidth="1.0" strokeDasharray="3 4" opacity="0.6" />

        {/* 3D Railroad Tracks Curving from Bottom-Left to Top-Right */}
        <path d="M 12 78 C 30 70, 50 64, 88 64 M 14 84 C 34 76, 54 70, 88 70" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        {/* Railway ties (wooden sleepers) */}
        <line x1="22" y1="74" x2="24" y2="82" stroke="#475569" strokeWidth="2" />
        <line x1="38" y1="67" x2="41" y2="75" stroke="#475569" strokeWidth="2" />
        <line x1="55" y1="64" x2="57" y2="72" stroke="#475569" strokeWidth="2" />
        <line x1="72" y1="64" x2="73" y2="71" stroke="#475569" strokeWidth="2" />

        {/* Train Cap (列車長鋪路大盤帽) shape */}
        {/* Cap Crown/Top */}
        <path d="M26 38 C28 22, 72 22, 74 38 C60 36, 40 36, 26 38 Z" fill="url(#railBlue)" stroke="#3b82f6" strokeWidth="1" />
        
        {/* Cap Visor/Brim (帽舌) */}
        <path d="M25 43 C38 48, 62 48, 75 43 C70 51, 30 51, 25 43 Z" fill="#020617" stroke="#3b82f6" strokeWidth="0.8" />
        
        {/* Cap Gold Band with Trim */}
        <rect x="25.5" y="38" width="49" height="5.5" rx="1" fill="url(#goldCapTrim)" />
        <line x1="25.5" y1="38" x2="74.5" y2="38" stroke="#d97706" strokeWidth="0.6" />
        <line x1="25.5" y1="43.5" x2="74.5" y2="43.5" stroke="#d97706" strokeWidth="0.6" />
        
        {/* Conductor Badge (胸章/帽徽: Winged wheel or Star in circle) */}
        <circle cx="50" cy="40.7" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
        <polygon points="50 38.2, 51.2 40.5, 53.5 40.7, 51.7 42.2, 52.2 44.5, 50 43.2, 47.8 44.5, 48.3 42.2, 46.5 40.7, 48.8 40.5" fill="#ffffff" />

        {/* Stern Glowing Eyes below Visor */}
        <line x1="40" y1="53" x2="45" y2="52" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="53" x2="55" y2="52" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="42.5" cy="55.5" r="1.5" fill="#60a5fa" className="animate-pulse" />
        <circle cx="57.5" cy="55.5" r="1.5" fill="#60a5fa" className="animate-pulse" />

        {/* Small Golden Railway Whistle on the side */}
        <path d="M 20 54 L 20 62 L 23 62 L 23 57 L 26 57 L 26 54 Z" fill="url(#goldCapTrim)" stroke="#ca8a04" strokeWidth="0.8" />
        <circle cx="21.5" cy="56" r="1" fill="#000000" />
      </svg>
    );
  }

  if (characterId === 'wind_eagle') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="weGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#115e59" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="weWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#99f6e4" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
        </defs>
        {/* Glow Ambient Circular Cloud */}
        <circle cx="50" cy="50" r="47" fill="url(#weGlow)" />

        {/* Outer wind lines and kite strings */}
        <circle cx="50" cy="50" r="34" fill="#042f2c" stroke="#14b8a6" strokeWidth="2.0" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke="#2dd4bf" strokeWidth="1.0" strokeDasharray="3 4" opacity="0.6" />

        {/* Soaring Wind Swirl spirals */}
        <path d="M22 58 Q34 68, 50 50 T78 42" stroke="rgba(45, 212, 191, 0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M18 42 Q38 28, 50 50 T82 58" stroke="rgba(20, 184, 166, 0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Dynamic Flying Diamond Kite shape (萬箏之王) */}
        <path
          d="M50 20 L68 38 L50 62 L32 38 Z"
          fill="url(#weWing)"
          stroke="#99f6e4"
          strokeWidth="1.8"
        />

        {/* Kite Crossbones structure */}
        <line x1="50" y1="20" x2="50" y2="62" stroke="#ffffff" strokeWidth="1.2" opacity="0.85" />
        <line x1="32" y1="38" x2="68" y2="38" stroke="#ffffff" strokeWidth="1.2" opacity="0.85" />

        {/* Feather wing details on the outer diamond */}
        <path d="M38 38 L32 46 M44 38 L40 50 M62 38 L68 46 M56 38 L60 50" stroke="#14b8a6" strokeWidth="1.2" strokeLinecap="round" />

        {/* Sharp Eagle Eye mask at center */}
        <polygon points="42 43, 50 40, 58 43, 50 48" fill="#115e59" stroke="#99f6e4" strokeWidth="0.8" />
        <circle cx="45" cy="44" r="1.5" fill="#5eead4" className="animate-pulse" />
        <circle cx="55" cy="44" r="1.5" fill="#5eead4" className="animate-pulse" />

        {/* Elegant Soaring kite streamers / curly tails */}
        <path
          d="M50 62 C46 68, 48 76, 44 82"
          stroke="#14b8a6"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 62 C54 68, 52 76, 56 82"
          stroke="#14b8a6"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="44" cy="83" r="1" fill="#2dd4bf" />
        <circle cx="56" cy="83" r="1" fill="#2dd4bf" />
      </svg>
    );
  }

  if (characterId === 'explorer') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="expGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#ca8a04" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="expHat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="40%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>
          <linearGradient id="ropeGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="metallicPick" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d6d3d1" />
            <stop offset="50%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#44403c" />
          </linearGradient>
        </defs>
        {/* Deep Mysterious Amber / Gold Background Fireglow */}
        <circle cx="50" cy="50" r="48" fill="url(#expGlow)" />

        {/* Outer Circular Coiled Adventure Rope Border */}
        <circle cx="50" cy="50" r="34" fill="#1c1917" stroke="url(#ropeGold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />

        {/* Ancient Temple Masonry brick patterns */}
        <path d="M 25 50 L 75 50 M 34 32 L 66 32 M 34 68 L 66 68" stroke="#44403c" strokeWidth="1" opacity="0.5" />
        <path d="M 32 32 L 32 50 M 68 32 L 68 50 M 50 50 L 50 68" stroke="#44403c" strokeWidth="1" opacity="0.5" />

        {/* Coiled Lasso hanging loop on left background */}
        <path d="M 23 55 C 16 55, 16 75, 23 75 C 30 75, 30 55, 23 55 Z" stroke="url(#ropeGold)" strokeWidth="1.5" fill="none" opacity="0.8" strokeDasharray="3 1" />
        <path d="M 24 57 C 18 57, 18 73, 24 73 C 30 73, 30 57, 24 57 Z" stroke="#ca8a04" strokeWidth="1.0" fill="none" opacity="0.6" />

        {/* Crossed Heavy Iron Pickaxes behind hat */}
        <path d="M 32 58 L 20 70 M 20 70 L 16 68" stroke="url(#metallicPick)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 68 58 L 80 70 M 80 70 L 84 68" stroke="url(#metallicPick)" strokeWidth="3" strokeLinecap="round" />
        {/* Golden pickaxe bindings */}
        <circle cx="28" cy="62" r="1.5" fill="#fbbf24" />
        <circle cx="72" cy="62" r="1.5" fill="#fbbf24" />

        {/* Rugged Stetson Explorer Fedora Hat */}
        {/* Hat Crown (creased center) */}
        <path
          d="M32 40 C34 18, 43 20, 50 22 C57 20, 66 18, 68 40 C59 37.5, 41 37.5, 32 40 Z"
          fill="url(#expHat)"
          stroke="#451a03"
          strokeWidth="1.2"
        />
        {/* Premium Crimson/Gold Silk Hat Ribbon */}
        <path d="M30.6 39.2 C40 37.5, 60 37.5, 69.4 39.2 L68.8 42.8 C60 41, 40 41, 31.2 42.8 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.6" />
        {/* Gold buckle on the hatband */}
        <rect x="47" y="39.5" width="6" height="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" rx="0.5" />

        {/* Hat Brim with double-stitch line and curled side edges */}
        <path
          d="M 16 43.5 Q 12 43.5, 18 41.5 C 28 38.5, 72 38.5, 82 41.5 Q 88 43.5, 84 43.5 C 72 46, 28 46, 16 43.5 Z"
          fill="#451a03"
          stroke="#1c1917"
          strokeWidth="1.2"
        />

        {/* Glowing Relic Golden Sun Compass Core below Brim */}
        {/* Compass main dial casing */}
        <circle cx="50" cy="55" r="8" fill="#1c1917" stroke="url(#ropeGold)" strokeWidth="1.5" />
        {/* Compass glow backing */}
        <circle cx="50" cy="55" r="6" fill="#f59e0b" className="animate-pulse" opacity="0.9" />
        {/* Dial ticks */}
        <line x1="50" y1="48.5" x2="50" y2="61.5" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
        <line x1="43.5" y1="55" x2="56.5" y2="55" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
        {/* Miniature Cardinal Direction Marks (N, S, E, W tick pointers) */}
        <path d="M 50 49 L 51 51 L 49 51 Z" fill="#ef4444" /> {/* North is red */}
        <path d="M 50 61 L 51 59 L 49 59 Z" fill="#94a3b8" />
        <path d="M 56 55 L 54 54 L 54 56 Z" fill="#94a3b8" />
        <path d="M 44 55 L 46 54 L 46 56 Z" fill="#94a3b8" />
        
        {/* center glint */}
        <circle cx="50" cy="55" r="2" fill="#ffffff" />

        {/* Ambient sparkling golden dust particles */}
        <circle cx="28" cy="48" r="1.2" fill="#fbbf24" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="73" cy="48" r="0.9" fill="#fef08a" />
        <circle cx="50" cy="69" r="1.3" fill="#fbbf24" />
        <circle cx="34" cy="67" r="0.8" fill="#eab308" />
        <circle cx="66" cy="67" r="1.0" fill="#fde047" />
      </svg>
    );
  }

  if (characterId === 'silent') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="silentGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#1e293b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wideHat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="funnelLight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Mysterious Dark Fog Glow */}
        <circle cx="50" cy="50" r="48" fill="url(#silentGlow)" />
        
        {/* Outer Circular Boundary */}
        <circle cx="50" cy="50" r="34" fill="#0f172a" stroke="#475569" strokeWidth="2.0" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />

        {/* Funnel projection light rays symbol */}
        <path d="M 50 55 L 25 90 L 75 90 Z" fill="url(#funnelLight)" opacity="0.3" />

        {/* Pale / Ghostly White Face silhouette under hood */}
        <path d="M 33 50 C 33 39, 67 39, 67 50 C 67 61, 33 61, 33 50 Z" fill="#f8fafc" opacity="0.9" />

        {/* Wide Brimmed Hat (寬簷暗灰布帽) */}
        {/* Hat Crown */}
        <path d="M 32 36 C 35 18, 65 18, 68 36 Z" fill="url(#wideHat)" stroke="#0f172a" strokeWidth="1" />
        {/* Hat Visor / Broad Brim */}
        <path d="M 12 37 C 25 35, 75 35, 88 37 C 88 43, 12 43, 12 37 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />

        {/* Silver glowing eyes casting fine cold light */}
        <circle cx="41" cy="46" r="3" fill="#cbd5e1" className="animate-pulse" />
        <circle cx="41" cy="46" r="1.5" fill="#f1f5f9" />
        <circle cx="59" cy="46" r="3" fill="#cbd5e1" className="animate-pulse" />
        <circle cx="59" cy="46" r="1.5" fill="#f1f5f9" />
        {/* Eye details - cold narrow gaze */}
        <path d="M 35 44 L 46 47" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 65 44 L 54 47" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />

        {/* Veil (口鼻處裹著一層薄款黑色半透紗巾) */}
        <path d="M 34 50 L 66 50 L 58 64 L 42 64 Z" fill="#020617" opacity="0.85" stroke="#1e293b" strokeWidth="0.5" />
        <line x1="38" y1="54" x2="62" y2="54" stroke="#0f172a" strokeWidth="0.8" opacity="0.4" />
        <line x1="40" y1="58" x2="60" y2="58" stroke="#0f172a" strokeWidth="0.8" opacity="0.4" />

        {/* Silent sign / Mist */}
        <circle cx="25" cy="58" r="1.2" fill="#94a3b8" opacity="0.6" />
        <circle cx="75" cy="58" r="1.2" fill="#94a3b8" opacity="0.6" />
        <circle cx="18" cy="48" r="1.0" fill="#64748b" opacity="0.4" />
        <circle cx="82" cy="48" r="1.0" fill="#64748b" opacity="0.4" />
      </svg>
    );
  }

  if (characterId === 'flash_bird') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="birdGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="birdWings" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="birdBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Ambient Golden Pulsing Glow */}
        <circle cx="50" cy="50" r="46" fill="url(#birdGlow)" className="animate-pulse" />

        {/* Celestial flight circular border */}
        <circle cx="50" cy="50" r="34" fill="#0c0a09" stroke="#eab308" strokeWidth="2.0" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="#fef08a" strokeWidth="1.0" strokeDasharray="3 4" opacity="0.5" />

        {/* Flow light rays in background */}
        <path d="M15 50 L35 50 M65 50 L85 50 M50 15 L50 35 M50 65 L50 85" stroke="#eab308" strokeWidth="1" opacity="0.3" />
        <path d="M25 25 L38 38 M62 62 L75 75 M75 25 L62 38 M38 62 L25 75" stroke="#eab308" strokeWidth="1" opacity="0.2" />

        {/* Dynamic Curved Feathers / Wing silhouettes */}
        <path
          d="M18 42 C24 30, 40 38, 50 46 C60 38, 76 30, 82 42 C72 56, 62 52, 50 64 C38 52, 28 56, 18 42 Z"
          fill="url(#birdWings)"
          stroke="#ca8a04"
          strokeWidth="1.2"
        />

        {/* Golden lightning bolts on the wings */}
        <path d="M 28 35 L 34 41 L 30 43 L 36 49" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 72 35 L 66 41 L 70 43 L 64 49" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Main Silver Bird Body */}
        <circle cx="50" cy="52" r="14.5" fill="url(#birdBody)" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Pointy Golden Crest Feathers (頭頂羽冠) */}
        <path d="M47 38 L50 25 L53 38 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
        <path d="M41 40 L45 30 L46 38 Z" fill="#fbbf24" opacity="0.8" />
        <path d="M59 40 L55 30 L54 38 Z" fill="#fbbf24" opacity="0.8" />

        {/* Glowing vertical cat slit golden eyes */}
        <ellipse cx="44" cy="50" rx="3.5" ry="2.2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <ellipse cx="56" cy="50" rx="3.5" ry="2.2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        
        {/* Cat vertical pupils */}
        <line x1="44" y1="47.5" x2="44" y2="52.5" stroke="#0c0a09" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="56" y1="47.5" x2="56" y2="52.5" stroke="#0c0a09" strokeWidth="1.2" strokeLinecap="round" />

        {/* Miniature Sharp Gold Beak */}
        <polygon points="48.5 53, 50 59, 51.5 53" fill="#eab308" stroke="#ca8a04" strokeWidth="0.6" />

        {/* Sparkle fragments */}
        <circle cx="28" cy="62" r="1.2" fill="#fffbeb" className="animate-pulse" />
        <circle cx="72" cy="62" r="1.2" fill="#fffbeb" className="animate-pulse" />
        <circle cx="50" cy="72" r="1.5" fill="#fde047" />
      </svg>
    );
  }

  if (characterId === 'harvey') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="harveyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#ea580c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="harveyBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="sleepingBag" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="50%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Warm Cozy Glow */}
        <circle cx="50" cy="50" r="46" fill="url(#harveyGlow)" />

        {/* Circular compass background ring */}
        <circle cx="50" cy="50" r="34" fill="#1c1917" stroke="#ea580c" strokeWidth="2" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />

        {/* Woods/Log and Campfire background */}
        <g stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
          <line x1="38" y1="72" x2="62" y2="60" />
          <line x1="62" y1="72" x2="38" y2="60" />
        </g>
        <path d="M44 60 C44 50, 50 42, 50 42 C50 42, 56 50, 56 60 Z" fill="#eb5e28" opacity="0.9" />
        <path d="M47 60 C47 54, 50 48, 50 48 C50 48, 53 54, 53 60 Z" fill="#f97316" />

        {/* Rolled Up Sleeping Bag on Top */}
        <rect x="35" y="14" width="30" height="9" rx="4.5" fill="url(#sleepingBag)" stroke="#d97706" strokeWidth="1" />
        <line x1="42" y1="14" x2="42" y2="23" stroke="#451a03" strokeWidth="1" />
        <line x1="58" y1="14" x2="58" y2="23" stroke="#451a03" strokeWidth="1" />

        {/* Main Goggled Ball Body */}
        <circle cx="50" cy="46" r="14" fill="url(#harveyBody)" stroke="#78350f" strokeWidth="1.5" />

        {/* Goggles Strap */}
        <rect x="34" y="42" width="32" height="3.5" fill="#451a03" rx="1" />

        {/* Compass/Goggle Lenses */}
        <circle cx="43" cy="44" r="4.5" fill="#22d3ee" stroke="#f1f5f9" strokeWidth="1.2" />
        <circle cx="57" cy="44" r="4.5" fill="#22d3ee" stroke="#f1f5f9" strokeWidth="1.2" />
        <path d="M41 42 L45 46 M55 42 L59 46" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

        {/* Cute rosy cheeks & tiny leaf on bottom */}
        <circle cx="39" cy="49" r="1.5" fill="#ef4444" opacity="0.6" />
        <circle cx="61" cy="49" r="1.5" fill="#ef4444" opacity="0.6" />

        {/* Small floating green leaves */}
        <path d="M22 36 C22 36, 26 34, 25 38 C24 40, 22 36, 22 36 Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.5" />
        <path d="M78 38 C78 38, 74 36, 75 40 C76 42, 78 38, 78 38 Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.5" />
      </svg>
    );
  }

  if (characterId === 'poke') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="pokeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pokeBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="fishingStrawHat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Deep ocean glow */}
        <circle cx="50" cy="50" r="46" fill="url(#pokeGlow)" />

        {/* Fishing Wheel/Compass line styling in back */}
        <circle cx="50" cy="50" r="33" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />

        {/* Diagonal fishing rod silhouette behind hat */}
        <line x1="22" y1="78" x2="78" y2="22" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M78 22 L83 17" stroke="#94a3b8" strokeWidth="0.8" />

        {/* Stylized mesh/net overlay */}
        <path d="M26 40 L74 40 M24 50 L76 50 M26 60 L74 60 M40 26 L40 74 M50 24 L50 76 M60 26 L60 74" stroke="#0284c7" strokeWidth="0.5" opacity="0.4" />

        {/* Fisherman body */}
        <circle cx="50" cy="52" r="13.5" fill="url(#pokeBody)" stroke="#0c4a6e" strokeWidth="1.5" />

        {/* Cute straw hat on top */}
        {/* Hat Dome */}
        <path d="M40 38 Q50 20 60 38 Z" fill="url(#fishingStrawHat)" stroke="#ca8a04" strokeWidth="1" />
        {/* Hat brim */}
        <ellipse cx="50" cy="38" rx="20" ry="2.8" fill="url(#fishingStrawHat)" stroke="#ca8a04" strokeWidth="1" />
        <rect x="42" y="35.5" width="16" height="2" fill="#ef4444" />

        {/* Focused determined eyes */}
        <ellipse cx="44" cy="50" rx="3.2" ry="1.8" fill="#ffffff" stroke="#0c4a6e" strokeWidth="1" />
        <ellipse cx="56" cy="50" rx="3.2" ry="1.8" fill="#ffffff" stroke="#0c4a6e" strokeWidth="1" />
        <circle cx="45" cy="50" r="1.2" fill="#0ea5e9" />
        <circle cx="55" cy="50" r="1.2" fill="#0ea5e9" />

        {/* Wooden bucket & small floating orange buoy icon at bottom-right */}
        <path d="M24 64 L22 72 L30 72 L28 64 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.8" opacity="0.8" />
        <circle cx="74" cy="66" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
        <rect x="73.5" y="63" width="1" height="6" fill="#ffffff" />

        {/* Water droplets */}
        <path d="M36 68 C36 68, 38 72, 36 73 C34 74, 34 71, 36 68 Z" fill="#38bdf8" opacity="0.8" />
      </svg>
    );
  }

  if (characterId === 'lie') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="lieNewGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="imperialJade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="30%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="spearMetalGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="royalRuby" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
          <linearGradient id="jadeGoldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Ambient Divine Emerald Halo */}
        <circle cx="50" cy="50" r="46" fill="url(#lieNewGlow)" className="animate-pulse" />

        {/* Outer Runic Segmented Golden-Jade Ring */}
        <circle cx="50" cy="50" r="34" fill="#022c22" stroke="url(#jadeGoldCrown)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke="#34d399" strokeWidth="1.0" strokeDasharray="4 4" opacity="0.75" />

        {/* Crossed Spear Shafts with Golden metallic textures */}
        <line x1="18" y1="82" x2="82" y2="18" stroke="url(#spearMetalGold)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="82" y1="82" x2="18" y2="18" stroke="url(#spearMetalGold)" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* Crossed Spears Golden Trident Wingheads */}
        <path d="M 76 14 Q 85 15, 86 24 Z" fill="url(#spearMetalGold)" />
        <path d="M 24 14 Q 15 15, 14 24 Z" fill="url(#spearMetalGold)" />

        {/* Centerpiece: Jade Dragon Shield Crest */}
        <path
          d="M50 22 L73 35 L66 65 L50 78 L34 65 L27 35 Z"
          fill="url(#imperialJade)"
          stroke="#064e3b"
          strokeWidth="2.0"
        />

        {/* Shimmering Lustre Plate highlight */}
        <path
          d="M50 22 L73 35 L50 49 L27 35 Z"
          fill="#ffffff"
          opacity="0.22"
        />

        {/* Center Golden Dragon Claw Emblem */}
        <path
          d="M50 36 L54 44 L46 44 Z M50 44 L55 53 L45 53 Z"
          fill="url(#spearMetalGold)"
          opacity="0.95"
        />

        {/* Dynamic Royal Ruby and Gold Tassels (赤金流蘇掛穗) */}
        <circle cx="50" cy="54" r="5" fill="url(#royalRuby)" stroke="#fbbf24" strokeWidth="1.2" />
        <path d="M46 58 Q50 68, 44 76 M54 58 Q50 68, 56 76" stroke="url(#royalRuby)" strokeWidth="2.0" strokeLinecap="round" />
        <path d="M50 58 L50 79" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />

        {/* Majestic Central Emerald Spear Head pointing skyward */}
        <path d="M50 8 L56 19 L50 25 L44 19 Z" fill="url(#spearMetalGold)" stroke="#064e3b" strokeWidth="1.2" />
        <line x1="50" y1="8" x2="50" y2="25" stroke="#ffffff" strokeWidth="1.0" />

        {/* Pair of glowing warrior emerald slits */}
        <polygon points="38 41, 45 42, 43 45, 37 43" fill="#00ff99" />
        <circle cx="41.5" cy="42.5" r="1" fill="#ffffff" />
         
        <polygon points="62 41, 55 42, 57 45, 63 43" fill="#00ff99" />
        <circle cx="58.5" cy="42.5" r="1" fill="#ffffff" />

        {/* Divine Sparkles & Stars */}
        <circle cx="20" cy="30" r="1.5" fill="#34d399" className="animate-pulse" />
        <circle cx="80" cy="30" r="1.5" fill="#34d399" className="animate-pulse" />
        <circle cx="50" cy="4" r="2.0" fill="#a7f3d0" />
      </svg>
    );
  }

  if (characterId === 'gambler') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="gamblerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#9f1239" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#310404" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pokerRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
          <linearGradient id="pokerCardGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Outer glowing aura */}
        <circle cx="50" cy="50" r="47" fill="url(#gamblerGlow)" className="animate-pulse" />

        {/* Casino circular croupier table pattern */}
        <circle cx="50" cy="50" r="34" fill="#1e293b" stroke="url(#pokerCardGold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.8" />

        {/* Four golden casino chips / glyphs at cardinal directions */}
        <circle cx="50" cy="19" r="1.8" fill="#fbbf24" />
        <circle cx="50" cy="81" r="1.8" fill="#fbbf24" />
        <circle cx="19" cy="50" r="1.8" fill="#fbbf24" />
        <circle cx="81" cy="50" r="1.8" fill="#fbbf24" />

        {/* Three Fan-shaped spreading poker cards in the background */}
        {/* Left card */}
        <g transform="translate(42, 45) rotate(-22)">
          <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <text x="0" y="2" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">♥</text>
          <text x="-5" y="-7" fill="#ef4444" fontSize="5" fontWeight="bold" textAnchor="middle">A</text>
        </g>
        {/* Right card */}
        <g transform="translate(58, 45) rotate(22)">
          <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <text x="0" y="2" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">♣</text>
          <text x="-5" y="-7" fill="#1e293b" fontSize="5" fontWeight="bold" textAnchor="middle">K</text>
        </g>
        {/* Center card */}
        <g transform="translate(50, 42)">
          <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#ffffff" stroke="url(#pokerCardGold)" strokeWidth="1.2" />
          <text x="0" y="2" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">♦</text>
          <text x="-5" y="-7" fill="#ef4444" fontSize="5" fontWeight="bold" textAnchor="middle">Q</text>
        </g>

        {/* Croupier sphere / chip core */}
        <circle cx="50" cy="54" r="15" fill="url(#pokerRed)" stroke="url(#pokerCardGold)" strokeWidth="2.0" />

        {/* Big Spades logo in the center of the sphere */}
        <text x="50" y="55" fill="#f59e0b" fontSize="17" fontWeight="black" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none">♠</text>

        {/* Royal glowing eye slits */}
        <circle cx="43" cy="48" r="1.2" fill="#ffffff" />
        <circle cx="57" cy="48" r="1.2" fill="#ffffff" />

        {/* Casino wheel rays decoration inside */}
        <path d="M 50 22 C 55 25, 45 31, 50 35" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" fill="none" />
      </svg>
    );
  }

  if (characterId === 'botanist') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="botanistGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {/* Glow backdrop */}
        <circle cx="50" cy="50" r="46" fill="url(#botanistGlow)" className="animate-pulse" />
        
        {/* Outer Celtic Vine Ring */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#16a34a" strokeWidth="2.0" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="4 4" />
        
        {/* Swirling vines */}
        <path d="M50 15 C60 15, 80 30, 80 50 C80 70, 60 85, 50 85 C40 85, 20 70, 20 50 C20 30, 40 15, 50 15 Z" stroke="#15803d" strokeWidth="1.2" opacity="0.65" />
        
        {/* Two symmetrical Leaves */}
        {/* Left Leaf */}
        <path d="M28 50 C28 40, 42 38, 46 50 C42 62, 28 60, 28 50 Z" fill="url(#leafGrad)" stroke="#16a34a" strokeWidth="1.2" />
        <path d="M28 50 Q37 47, 46 50" stroke="#052e16" strokeWidth="1" opacity="0.5" />
        
        {/* Right Leaf */}
        <path d="M72 50 C72 40, 58 48, 54 50 C58 52, 72 60, 72 50 Z" fill="url(#leafGrad)" stroke="#16a34a" strokeWidth="1.2" />
        <path d="M54 50 Q63 53, 72 50" stroke="#052e16" strokeWidth="1" opacity="0.5" />
        
        {/* Glowing Central Flower Core */}
        <circle cx="50" cy="50" r="16" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
        
        {/* Golden Flower Petals */}
        <g transform="translate(50, 50)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <path
              key={idx}
              d="M0 -6 C4 -14, -4 -14, 0 -6 Z"
              fill="url(#flowerGrad)"
              stroke="#ca8a04"
              strokeWidth="0.8"
              transform={`rotate(${angle})`}
            />
          ))}
          {/* Inner golden seed core */}
          <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          {/* Bright spores */}
          <circle cx="-2" cy="-2" r="1" fill="#fff" />
          <circle cx="2" cy="1" r="1" fill="#fff" />
        </g>
        
        {/* Glowing eyes */}
        <circle cx="43" cy="46" r="1.5" fill="#facc15" className="animate-pulse" />
        <circle cx="57" cy="46" r="1.5" fill="#facc15" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'painter') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="painterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#c084fc" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="brushHandle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="inkWash" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#090514" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
          <radialGradient id="robeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="80%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
        </defs>

        {/* Ambient Watercolor / Ink Glow Backdrop */}
        <circle cx="50" cy="50" r="46" fill="url(#painterGlow)" className="animate-pulse" />

        {/* Outer Scholar Ring with rotating ink droplets dash */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="#475569" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="39" fill="none" stroke="#a855f7" strokeWidth="1.0" strokeDasharray="6 8" opacity="0.75" />

        {/* Swirling Ink Splash curves */}
        <path d="M22 65 C28 50, 48 45, 52 28 C56 45, 68 52, 75 42" stroke="url(#inkWash)" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
        <path d="M25 67 C35 55, 65 55, 78 70" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

        {/* The Painter Scroll (rolled up in background) */}
        <g transform="translate(34, 42) rotate(-35)">
          <rect x="-4" y="-12" width="8" height="24" rx="1.5" fill="#fef08a" stroke="#451a03" strokeWidth="1.0" />
          <line x1="-4" y1="-7" x2="4" y2="-7" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="-4" y1="7" x2="4" y2="7" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="2" fill="#78350f" />
        </g>

        {/* The Head / Face of the Scholarly Painter */}
        <circle cx="50" cy="48" r="14" fill="url(#robeGrad)" stroke="#334155" strokeWidth="1.5" />
        
        {/* Scholar Hat (Academic headwear) */}
        <path d="M38 38 L62 38 L58 28 L42 28 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <rect x="40" y="36" width="20" height="3" fill="#6366f1" />
        <line x1="50" y1="28" x2="50" y2="23" stroke="#e0f2fe" strokeWidth="1" />
        <circle cx="50" cy="22" r="1.5" fill="#f5d0fe" />

        {/* Hair side-burns */}
        <path d="M36 44 Q38 48, 38 52" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M64 44 Q62 48, 62 52" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

        {/* Serene closed eyes (Scholarly elegance) */}
        <path d="M43 48 Q46 51, 48 48" stroke="#0f172a" strokeWidth="1.2" fill="none" />
        <path d="M52 48 Q54 51, 57 48" stroke="#0f172a" strokeWidth="1.2" fill="none" />

        {/* Forehead Crimson Scroll Mark */}
        <path d="M50 40 L49 43 L51 43 Z" fill="#b91c1c" />

        {/* Magic Paintbrush weapon crossing in front */}
        <g transform="translate(62, 58) rotate(22)">
          {/* Handle */}
          <line x1="0" y1="18" x2="0" y2="-12" stroke="url(#brushHandle)" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Metal ring ferrule */}
          <rect x="-1.5" y="-14" width="3" height="3" fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.5" />
          
          {/* Brush head hairs */}
          <path d="M-1.5 -14 L0 -24 L1.5 -14 Z" fill="#111827" stroke="#374151" strokeWidth="0.5" />
          
          {/* Purple luminous magical ink on the tip */}
          <path d="M-0.75 -20 L0 -26 L0.75 -20 Z" fill="#c084fc" />
          <circle cx="0" cy="-26.5" r="1.5" fill="#e9d5ff" className="animate-pulse" />
        </g>

        {/* Rising Ink Beads around character */}
        <circle cx="28" cy="40" r="1.8" fill="#1e1b4b" opacity="0.8" />
        <circle cx="70" cy="36" r="1.2" fill="#a855f7" className="animate-pulse" />
        <circle cx="68" cy="74" r="2.2" fill="#581c87" />
        <circle cx="32" cy="72" r="1.5" fill="#312e81" />
      </svg>
    );
  }

  if (characterId === 'scythe') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        <defs>
          <radialGradient id="scytheGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c1a28" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#31102f" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f050d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scytheBlade" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="30%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
          <linearGradient id="scytheStaff" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="demonHood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Hellish Blood Glow Backdrop */}
        <circle cx="50" cy="50" r="46" fill="url(#scytheGlow)" className="animate-pulse" />

        {/* Obsidian Runic Hellcircle Ring */}
        <circle cx="50" cy="50" r="37" fill="none" stroke="#dc2626" strokeWidth="1.2" opacity="0.65" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#7c1a28" strokeWidth="1.0" strokeDasharray="4 6" opacity="0.8" />

        {/* Pentagram-style intersecting shadow lines */}
        <path d="M50 14 L81 72 L19 72 Z" stroke="#31102f" strokeWidth="1.0" strokeLinecap="round" opacity="0.3" />
        <path d="M50 86 L19 28 L81 28 Z" stroke="#31102f" strokeWidth="1.0" strokeLinecap="round" opacity="0.3" />

        {/* The Giant Curved Demonic Scythe in Background */}
        <g transform="translate(48, 48) rotate(-40)">
          {/* Staff (handle) */}
          <line x1="-35" y1="35" x2="16" y2="-16" stroke="url(#scytheStaff)" strokeWidth="3.2" strokeLinecap="round" />
          {/* Spearhead or end cap */}
          <path d="M-35 35 L-39 39 L-33 37 Z" fill="#4c0519" stroke="#fda4af" strokeWidth="0.5" />
          {/* Scythe Curved Blade */}
          <path d="M12 -12 C18 -25, 45 -22, 42 -2 C30 -10, 18 -10, 12 -12 Z" fill="url(#scytheBlade)" stroke="#dc2626" strokeWidth="0.8" />
          {/* Blade ornament / runic eye */}
          <circle cx="21" cy="-12" r="1.5" fill="#fecdd3" stroke="#f43f5e" strokeWidth="0.5" className="animate-ping" />
          <circle cx="21" cy="-12" r="1.5" fill="#e11d48" />
        </g>

        {/* Demon Hooded Skull / Grim Head */}
        <path d="M34 58 C32 40, 40 26, 50 26 C60 26, 68 40, 66 58 C66 68, 62 76, 50 76 C38 76, 34 68, 34 58 Z" fill="url(#demonHood)" stroke="#31102f" strokeWidth="2.0" />
        
        {/* Grim Reaper Mask / Silver Face Inner */}
        <path d="M39 56 C39 44, 44 34, 50 34 C56 34, 61 44, 61 56 C61 63, 58 70, 50 70 C42 70, 39 63, 39 56 Z" fill="#0f172a" stroke="#7c1a28" strokeWidth="1.2" />

        {/* Glowing Crimson Demonic Slit Eyes */}
        <ellipse cx="44" cy="48" rx="2.5" ry="1.0" fill="#f43f5e" transform="rotate(-6, 44, 48)" />
        <ellipse cx="56" cy="48" rx="2.5" ry="1.0" fill="#f43f5e" transform="rotate(6, 56, 48)" />

        <circle cx="44" cy="48" r="0.8" fill="#ffffff" />
        <circle cx="56" cy="48" r="0.8" fill="#ffffff" />

        {/* Demonic Horns scaling upwards */}
        <path d="M36 34 C30 20, 26 24, 28 14 C32 20, 36 28, 38 32" fill="#020617" stroke="#7c1a28" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M64 34 C70 20, 74 24, 72 14 C68 20, 64 28, 62 32" fill="#020617" stroke="#7c1a28" strokeWidth="1.5" strokeLinecap="round" />

        {/* Grim Gnash teeth outline */}
        <path d="M46 60 L54 60 L52 64 L48 64 Z" fill="#475569" stroke="#000" strokeWidth="0.5" />
        <line x1="48" y1="60" x2="48" y2="64" stroke="#000" strokeWidth="0.5" />
        <line x1="50" y1="60" x2="50" y2="64" stroke="#000" strokeWidth="0.5" />
        <line x1="52" y1="60" x2="52" y2="64" stroke="#000" strokeWidth="0.5" />

        {/* Floating Demon Soul Fire Beads */}
        <circle cx="24" cy="35" r="2.0" fill="#ec4899" className="animate-bounce" />
        <circle cx="76" cy="38" r="1.5" fill="#f43f5e" opacity="0.9" />
        <circle cx="72" cy="74" r="2.5" fill="#e11d48" className="animate-pulse" />
        <circle cx="28" cy="78" r="1.8" fill="#fda4af" />
      </svg>
    );
  }

  return null;
};
